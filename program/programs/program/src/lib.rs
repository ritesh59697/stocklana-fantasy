use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("hGenhdu1tQPYJCvKF1XnemEV83eo1gQvp7LgcmRcway");

pub const STAKE_AMOUNT: u64 = 5_000_000; // 5 USDC (6 decimals)
pub const MAX_PORTFOLIO_SIZE: usize = 5;
pub const USDC_MINT: Pubkey = pubkey!("44EBxuQYpphzxoe2pCRSBWYHP1rZJMNRDveEz3eHNXSt");

#[program]
pub mod stocklana_fantasy {
    use super::*;

    pub fn initialize_tournament(ctx: Context<InitializeTournament>) -> Result<()> {
        let tournament = &mut ctx.accounts.tournament;
        tournament.authority = ctx.accounts.authority.key();
        tournament.phase = GamePhase::Registration;
        tournament.total_staked = 0;
        tournament.bump = ctx.bumps.tournament;
        Ok(())
    }

    pub fn update_game_phase(ctx: Context<UpdateGamePhase>, new_phase: GamePhase) -> Result<()> {
        require!(ctx.accounts.tournament.authority == ctx.accounts.authority.key(), ErrorCode::Unauthorized);
        ctx.accounts.tournament.phase = new_phase;
        Ok(())
    }

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        user_state.owner = ctx.accounts.user.key();
        user_state.staked_amount = 0;
        user_state.portfolio = Vec::new();
        user_state.is_locked = false;
        user_state.has_entered = false;
        user_state.bump = ctx.bumps.user_state;
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        require!(ctx.accounts.tournament.phase == GamePhase::Registration, ErrorCode::RegistrationClosed);
        require!(amount == STAKE_AMOUNT, ErrorCode::InvalidStakeAmount);
        
        let user_state = &mut ctx.accounts.user_state;
        require!(user_state.staked_amount == 0, ErrorCode::AlreadyStaked);
        require!(!user_state.has_entered, ErrorCode::AlreadyEntered);
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        user_state.staked_amount = STAKE_AMOUNT;
        user_state.has_entered = true;
        
        let tournament = &mut ctx.accounts.tournament;
        tournament.total_staked = tournament.total_staked.checked_add(STAKE_AMOUNT).ok_or(ErrorCode::MathOverflow)?;

        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        let amount = user_state.staked_amount;
        require!(amount > 0, ErrorCode::NotStaked);
        
        let tournament = &mut ctx.accounts.tournament;
        if user_state.is_locked {
            require!(
                tournament.phase == GamePhase::Finished || tournament.phase == GamePhase::Settled, 
                ErrorCode::CannotUnstakeWhileLocked
            );
        }

        let tournament_key = tournament.key();
        let vault_bump = ctx.bumps.vault_token_account;
        let auth_seeds = &["vault".as_bytes(), tournament_key.as_ref(), &[vault_bump]];
        let signer = &[&auth_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault_token_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        user_state.staked_amount = 0;
        
        tournament.total_staked = tournament.total_staked.checked_sub(amount).ok_or(ErrorCode::MathOverflow)?;

        Ok(())
    }

    pub fn update_portfolio(ctx: Context<UpdatePortfolio>, new_portfolio: Vec<String>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        require!(user_state.staked_amount > 0, ErrorCode::NotStaked);
        require!(!user_state.is_locked, ErrorCode::PortfolioLocked);
        require!(new_portfolio.len() <= MAX_PORTFOLIO_SIZE, ErrorCode::PortfolioTooLarge);
        
        let valid_assets = ["AAPLx", "NVDAx", "TSLAx", "SPYx"];
        
        for i in 0..new_portfolio.len() {
            require!(valid_assets.contains(&new_portfolio[i].as_str()), ErrorCode::InvalidAsset);
            for j in 0..i {
                require!(new_portfolio[i] != new_portfolio[j], ErrorCode::DuplicateAsset);
            }
        }
        
        user_state.portfolio = new_portfolio;
        Ok(())
    }

    pub fn lock_portfolio(ctx: Context<LockPortfolio>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        require!(user_state.staked_amount > 0, ErrorCode::NotStaked);
        require!(!user_state.is_locked, ErrorCode::PortfolioLocked);
        require!(user_state.portfolio.len() > 0, ErrorCode::EmptyPortfolio);
        
        user_state.is_locked = true;
        Ok(())
    }

    pub fn initialize_vault(_ctx: Context<InitializeVault>) -> Result<()> {
        Ok(())
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum GamePhase {
    Registration,
    Locked,
    Finished,
    Settled,
}

#[account]
pub struct TournamentState {
    pub authority: Pubkey,
    pub phase: GamePhase,
    pub total_staked: u64,
    pub bump: u8,
}

#[account]
pub struct UserState {
    pub owner: Pubkey,
    pub staked_amount: u64,
    pub portfolio: Vec<String>,
    pub is_locked: bool,
    pub has_entered: bool,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct InitializeTournament<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 1 + 8 + 1, // discriminator + pubkey + enum + u64 + u8
        seeds = [b"tournament"],
        bump
    )]
    pub tournament: Account<'info, TournamentState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateGamePhase<'info> {
    #[account(mut, seeds = [b"tournament"], bump = tournament.bump)]
    pub tournament: Account<'info, TournamentState>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [b"vault", tournament.key().as_ref()],
        bump,
        token::mint = usdc_mint,
        token::authority = vault_token_account,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(address = USDC_MINT)]
    pub usdc_mint: Account<'info, Mint>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(seeds = [b"tournament"], bump = tournament.bump)]
    pub tournament: Account<'info, TournamentState>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + 8 + (4 + (5 * 10)) + 1 + 1 + 1, // added is_locked bool and has_entered bool
        seeds = [b"user_state", user.key().as_ref()], 
        bump
    )]
    pub user_state: Account<'info, UserState>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(
        mut,
        seeds = [b"tournament"],
        bump = tournament.bump,
    )]
    pub tournament: Account<'info, TournamentState>,
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump = user_state.bump,
    )]
    pub user_state: Account<'info, UserState>,
    #[account(
        mut,
        seeds = [b"vault", tournament.key().as_ref()],
        bump,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut, token::mint = vault_token_account.mint, token::authority = user)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(
        mut,
        seeds = [b"tournament"],
        bump = tournament.bump,
    )]
    pub tournament: Account<'info, TournamentState>,
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump = user_state.bump,
    )]
    pub user_state: Account<'info, UserState>,
    #[account(
        mut,
        seeds = [b"vault", tournament.key().as_ref()],
        bump,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut, token::mint = vault_token_account.mint, token::authority = user)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct UpdatePortfolio<'info> {
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump = user_state.bump,
    )]
    pub user_state: Account<'info, UserState>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct LockPortfolio<'info> {
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump = user_state.bump,
    )]
    pub user_state: Account<'info, UserState>,
    pub user: Signer<'info>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient staked funds.")]
    InsufficientFunds,
    #[msg("Must stake funds to play.")]
    NotStaked,
    #[msg("Portfolio can have maximum 5 assets.")]
    PortfolioTooLarge,
    #[msg("Stake amount must be exactly 5 USDC.")]
    InvalidStakeAmount,
    #[msg("User has already staked.")]
    AlreadyStaked,
    #[msg("Tournament registration is closed.")]
    RegistrationClosed,
    #[msg("Portfolio is already locked.")]
    PortfolioLocked,
    #[msg("Invalid asset provided.")]
    InvalidAsset,
    #[msg("Duplicate assets are not allowed.")]
    DuplicateAsset,
    #[msg("Portfolio cannot be empty when locking.")]
    EmptyPortfolio,
    #[msg("Mathematical overflow occurred.")]
    MathOverflow,
    #[msg("User has already entered and unstaked. Re-entry is forbidden.")]
    AlreadyEntered,
    #[msg("Unauthorized action.")]
    Unauthorized,
    #[msg("Cannot unstake while portfolio is locked in an active tournament.")]
    CannotUnstakeWhileLocked,
}
