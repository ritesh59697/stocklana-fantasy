import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Program as StocklanaFantasy } from "../target/types/stocklana_fantasy";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import { expect } from "chai";

describe("stocklana-fantasy", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.StocklanaFantasy as Program<StocklanaFantasy>;
  const wallet = provider.wallet as anchor.Wallet;

  let usdcMint: anchor.web3.PublicKey;
  let vaultTokenAccount: anchor.web3.PublicKey;
  let vaultBump: number;
  let tournamentState: anchor.web3.PublicKey;
  let tournamentBump: number;

  let user1 = anchor.web3.Keypair.generate();
  let user1TokenAccount: anchor.web3.PublicKey;
  let user1State: anchor.web3.PublicKey;
  let user1Bump: number;

  const STAKE_AMOUNT = new anchor.BN(5_000_000);

  before(async () => {
    // Airdrop SOL to user1
    const airdropSig = await provider.connection.requestAirdrop(
      user1.publicKey,
      anchor.web3.LAMPORTS_PER_SOL * 2
    );
    await provider.connection.confirmTransaction(airdropSig);

    // Create USDC mint
    usdcMint = await createMint(
      provider.connection,
      wallet.payer,
      wallet.publicKey,
      null,
      6
    );

    // Derive Tournament State PDA
    [tournamentState, tournamentBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("tournament")],
      program.programId
    );

    // Derive Vault PDA
    [vaultTokenAccount, vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault")],
      program.programId
    );

    // Initialize Tournament
    await program.methods
      .initializeTournament()
      .accounts({
        tournament: tournamentState,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Initialize Vault
    await program.methods
      .initializeVault()
      .accounts({
        vaultTokenAccount,
        usdcMint,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    // Create User Token Account
    user1TokenAccount = await createAccount(
      provider.connection,
      wallet.payer,
      usdcMint,
      user1.publicKey
    );

    // Mint 100 USDC to user1
    await mintTo(
      provider.connection,
      wallet.payer,
      usdcMint,
      user1TokenAccount,
      wallet.payer,
      100_000_000
    );

    // Derive User State PDA
    [user1State, user1Bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_state"), user1.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initialize User", async () => {
    await program.methods
      .initializeUser()
      .accounts({
        userState: user1State,
        user: user1.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    const state = await program.account.userState.fetch(user1State);
    expect(state.owner.toBase58()).to.equal(user1.publicKey.toBase58());
    expect(state.stakedAmount.toNumber()).to.equal(0);
    expect(state.isLocked).to.be.false;
  });

  it("Fails to stake 1 USDC", async () => {
    try {
      await program.methods
        .stake(new anchor.BN(1_000_000))
        .accounts({
          tournament: tournamentState,
          userState: user1State,
          vaultTokenAccount,
          userTokenAccount: user1TokenAccount,
          user: user1.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Stake amount must be exactly 5 USDC.");
    }
  });

  it("Fails to stake 10 USDC", async () => {
    try {
      await program.methods
        .stake(new anchor.BN(10_000_000))
        .accounts({
          tournament: tournamentState,
          userState: user1State,
          vaultTokenAccount,
          userTokenAccount: user1TokenAccount,
          user: user1.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Stake amount must be exactly 5 USDC.");
    }
  });

  it("Successfully stakes 5 USDC", async () => {
    await program.methods
      .stake(STAKE_AMOUNT)
      .accounts({
        tournament: tournamentState,
        userState: user1State,
        vaultTokenAccount,
        userTokenAccount: user1TokenAccount,
        user: user1.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user1])
      .rpc();

    const state = await program.account.userState.fetch(user1State);
    expect(state.stakedAmount.toNumber()).to.equal(5_000_000);

    const vaultInfo = await getAccount(provider.connection, vaultTokenAccount);
    expect(Number(vaultInfo.amount)).to.equal(5_000_000);
  });

  it("Fails to stake twice", async () => {
    try {
      await program.methods
        .stake(STAKE_AMOUNT)
        .accounts({
          tournament: tournamentState,
          userState: user1State,
          vaultTokenAccount,
          userTokenAccount: user1TokenAccount,
          user: user1.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("User has already staked.");
    }
  });

  it("Fails to update portfolio with more than 5 assets", async () => {
    try {
      await program.methods
        .updatePortfolio(["AAPLx", "NVDAx", "TSLAx", "SPYx", "AAPLx", "TSLAx"])
        .accounts({
          userState: user1State,
          user: user1.publicKey,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Portfolio can have maximum 5 assets.");
    }
  });

  it("Fails to update portfolio with duplicates", async () => {
    try {
      await program.methods
        .updatePortfolio(["AAPLx", "NVDAx", "AAPLx"])
        .accounts({
          userState: user1State,
          user: user1.publicKey,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Duplicate assets are not allowed.");
    }
  });

  it("Fails to update portfolio with invalid assets", async () => {
    try {
      await program.methods
        .updatePortfolio(["AAPLx", "RANDOM", "TSLAx"])
        .accounts({
          userState: user1State,
          user: user1.publicKey,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Invalid asset provided.");
    }
  });

  it("Successfully updates a valid portfolio", async () => {
    await program.methods
      .updatePortfolio(["AAPLx", "NVDAx", "TSLAx", "SPYx"])
      .accounts({
        userState: user1State,
        user: user1.publicKey,
      })
      .signers([user1])
      .rpc();

    const state = await program.account.userState.fetch(user1State);
    expect(state.portfolio.length).to.equal(4);
    expect(state.portfolio[0]).to.equal("AAPLx");
  });

  it("Successfully locks the portfolio", async () => {
    await program.methods
      .lockPortfolio()
      .accounts({
        userState: user1State,
        user: user1.publicKey,
      })
      .signers([user1])
      .rpc();

    const state = await program.account.userState.fetch(user1State);
    expect(state.isLocked).to.be.true;
  });

  it("Fails to update portfolio after locking", async () => {
    try {
      await program.methods
        .updatePortfolio(["AAPLx"])
        .accounts({
          userState: user1State,
          user: user1.publicKey,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Portfolio is already locked.");
    }
  });

  it("Successfully unstakes", async () => {
    await program.methods
      .unstake()
      .accounts({
        tournament: tournamentState,
        userState: user1State,
        vaultTokenAccount,
        userTokenAccount: user1TokenAccount,
        user: user1.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user1])
      .rpc();

    const state = await program.account.userState.fetch(user1State);
    expect(state.stakedAmount.toNumber()).to.equal(0);

    const vaultInfo = await getAccount(provider.connection, vaultTokenAccount);
    expect(Number(vaultInfo.amount)).to.equal(0);
  });
});
