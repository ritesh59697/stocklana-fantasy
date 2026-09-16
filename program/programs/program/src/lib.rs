use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("hGenhdu1tQPYJCvKF1XnemEV83eo1gQvp7LgcmRcway");

#[program]
pub mod stocklana_fantasy {
    use super::*;

    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        user_state.owner = ctx.accounts.user.key();
        user_state.staked_amount = 0;
        user_state.portfolio = Vec::new();
        user_state.bump = ctx.bumps.user_state;
        Ok(())
    }

    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        user_state.staked_amount = user_state.staked_amount.checked_add(amount).unwrap();

        Ok(())
    }

    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        require!(user_state.staked_amount >= amount, ErrorCode::InsufficientFunds);

        let vault_bump = ctx.bumps.vault_token_account;
        let auth_seeds = &["vault".as_bytes(), &[vault_bump]];
        let signer = &[&auth_seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault_token_account.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        user_state.staked_amount = user_state.staked_amount.checked_sub(amount).unwrap();

        Ok(())
    }

    pub fn update_portfolio(ctx: Context<UpdatePortfolio>, new_portfolio: Vec<String>) -> Result<()> {
        let user_state = &mut ctx.accounts.user_state;
        require!(user_state.staked_amount > 0, ErrorCode::NotStaked);
        
        // Ensure max 5 stocks per portfolio
        require!(new_portfolio.len() <= 5, ErrorCode::PortfolioTooLarge);
        
        user_state.portfolio = new_portfolio;
        Ok(())
    }

    pub fn initialize_vault(_ctx: Context<InitializeVault>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [b"vault"],
        bump,
        token::mint = usdc_mint,
        token::authority = vault_token_account,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    pub usdc_mint: Account<'info, Mint>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init, 
        payer = user, 
        space = 8 + 32 + 8 + (4 + (5 * 10)) + 1, // 5 strings of max length ~10
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
        seeds = [b"user_state", user.key().as_ref()],
        bump = user_state.bump,
    )]
    pub user_state: Account<'info, UserState>,
    #[account(
        mut,
        seeds = [b"vault"],
        bump,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(
        mut,
        seeds = [b"user_state", user.key().as_ref()],
        bump = user_state.bump,
    )]
    pub user_state: Account<'info, UserState>,
    #[account(
        mut,
        seeds = [b"vault"],
        bump,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
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

#[account]
pub struct UserState {
    pub owner: Pubkey,
    pub staked_amount: u64,
    pub portfolio: Vec<String>,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient staked funds.")]
    InsufficientFunds,
    #[msg("Must stake funds to play.")]
    NotStaked,
    #[msg("Portfolio can have maximum 5 assets.")]
    PortfolioTooLarge,
}
