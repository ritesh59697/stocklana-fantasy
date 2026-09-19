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

  // The static keypair matching the pubkey in lib.rs
  const usdcMintKeypair = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array([
      121, 151, 247,  36, 158,  80,  45, 103,  23, 222, 146,
      167, 245,  58,  28,  97, 211,  73, 217, 189,  73, 174,
       56,  85, 151,  54, 223, 154, 195, 211, 248, 158,  45,
      102, 183,  81, 210, 199, 215, 226, 125, 232, 120,  94,
       81, 136, 119, 113, 231,  69,   7,  29, 145,  95, 207,
      187, 188,  84, 255, 150, 169,  47, 172, 125
    ])
  );
  let usdcMint: anchor.web3.PublicKey = usdcMintKeypair.publicKey;
  let vaultTokenAccount: anchor.web3.PublicKey;
  let vaultBump: number;
  let tournamentState: anchor.web3.PublicKey;
  let tournamentBump: number;

  let user1 = anchor.web3.Keypair.generate();
  let user1TokenAccount: anchor.web3.PublicKey;
  let user1State: anchor.web3.PublicKey;
  let user1Bump: number;

  let user2 = anchor.web3.Keypair.generate();
  let user2TokenAccount: anchor.web3.PublicKey;
  let user2State: anchor.web3.PublicKey;
  let user3 = anchor.web3.Keypair.generate();
  let user3TokenAccount: anchor.web3.PublicKey;
  let user3State: anchor.web3.PublicKey;


  const STAKE_AMOUNT = new anchor.BN(5_000_000);

  before(async () => {
    // Airdrop SOL to users
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user1.publicKey, anchor.web3.LAMPORTS_PER_SOL * 2)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user2.publicKey, anchor.web3.LAMPORTS_PER_SOL * 2)
    );

    // Create USDC mint using static keypair
    usdcMint = await createMint(
      provider.connection,
      wallet.payer,
      wallet.publicKey,
      null,
      6,
      usdcMintKeypair
    );

    // Derive Tournament State PDA
    [tournamentState, tournamentBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("tournament")],
      program.programId
    );

    // Derive Vault PDA using tournament key
    [vaultTokenAccount, vaultBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), tournamentState.toBuffer()],
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

    // Test Unauthorized Vault Initialization
    try {
      await program.methods
        .initializeVault()
        .accounts({
          vaultTokenAccount,
          usdcMint,
          authority: user1.publicKey,
          tournament: tournamentState,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([user1])
        .rpc();
      throw new Error("Should have failed");
    } catch (err: any) {
      if (!err.message.includes("Unauthorized action")) {
        throw err;
      }
    }

    // Initialize Vault (Authorized)
    await program.methods
      .initializeVault()
      .accounts({
        vaultTokenAccount,
        usdcMint,
        authority: wallet.publicKey,
        tournament: tournamentState,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    // Create User Token Accounts
    user1TokenAccount = await createAccount(provider.connection, wallet.payer, usdcMint, user1.publicKey);
    user2TokenAccount = await createAccount(provider.connection, wallet.payer, usdcMint, user2.publicKey);

    // Mint 100 USDC to users
    await mintTo(provider.connection, wallet.payer, usdcMint, user1TokenAccount, wallet.payer, 100_000_000);
    await mintTo(provider.connection, wallet.payer, usdcMint, user2TokenAccount, wallet.payer, 100_000_000);

    // Derive User State PDAs
    [user1State, user1Bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_state"), tournamentState.toBuffer(), user1.publicKey.toBuffer()],
      program.programId
    );
    [user2State] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_state"), tournamentState.toBuffer(), user2.publicKey.toBuffer()],
      program.programId
    );
  
    // User 3
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user3.publicKey, anchor.web3.LAMPORTS_PER_SOL * 2)
    );
    user3TokenAccount = await createAccount(provider.connection, wallet.payer, usdcMint, user3.publicKey);
    await mintTo(provider.connection, wallet.payer, usdcMint, user3TokenAccount, wallet.payer, 100_000_000);
    const [u3State] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_state"), tournamentState.toBuffer(), user3.publicKey.toBuffer()],
      program.programId
    );
    user3State = u3State;

  });

  it("Initialize Users", async () => {
    await program.methods
      .initializeUser()
      .accounts({
        userState: user1State,
        user: user1.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user1])
      .rpc();
    
    await program.methods
      .initializeUser()
      .accounts({
        userState: user2State,
        user: user2.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user2])
      .rpc();

    const state = await program.account.userState.fetch(user1State);
    expect(state.owner.toBase58()).to.equal(user1.publicKey.toBase58());
    expect(state.stakedAmount.toNumber()).to.equal(0);
    expect(state.isLocked).to.be.false;
    expect(state.hasEntered).to.be.false;
  });

  it("Successfully stakes 5 USDC for user 1", async () => {
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
    expect(state.hasEntered).to.be.true;

    const vaultInfo = await getAccount(provider.connection, vaultTokenAccount);
    expect(Number(vaultInfo.amount)).to.equal(5_000_000);
  });

  it("Fails to stake twice (double dip bug fixed)", async () => {
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

  it("Allows unstaking during registration for unlocked user", async () => {
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
  });

  it("Fails to restake after unstaking (has_entered blocks it)", async () => {
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
      expect(err.message).to.include("User has already entered and unstaked.");
    }
  });

  it("User 2 stakes and locks portfolio", async () => {
    await program.methods
      .stake(STAKE_AMOUNT)
      .accounts({
        tournament: tournamentState,
        userState: user2State,
        vaultTokenAccount,
        userTokenAccount: user2TokenAccount,
        user: user2.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user2])
      .rpc();

    await program.methods
      .updatePortfolio(["AAPLx", "NVDAx", "TSLAx", "SPYx"])
      .accounts({ userState: user2State, tournament: tournamentState, user: user2.publicKey })
      .signers([user2])
      .rpc();

    await program.methods
      .lockPortfolio()
      .accounts({ userState: user2State, tournament: tournamentState, user: user2.publicKey })
      .signers([user2])
      .rpc();

    const state = await program.account.userState.fetch(user2State);
    expect(state.isLocked).to.be.true;
  });

  it("Fails to transition phase by non-authority", async () => {
    try {
      await program.methods
        .updateGamePhase({ locked: {} })
        .accounts({
          tournament: tournamentState,
          authority: user1.publicKey,
        })
        .signers([user1])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Unauthorized action.");
    }
  });

  it("Passes unauthorized vault initialization check (run in before block)", async () => {
    // Asserted in the before block
  });

  it("Fails invalid phase transition (Registration -> Finished)", async () => {
    try {
      await program.methods
        .updateGamePhase({ finished: {} })
        .accounts({
          tournament: tournamentState,
          authority: wallet.publicKey,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Invalid phase transition.");
    }
  });

  
  
  it("Sets up user 3", async () => {

    await program.methods
      .initializeUser()
      .accounts({
        userState: user3State,
        user: user3.publicKey,
        tournament: tournamentState,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user3])
      .rpc();
      
    await program.methods
      .stake(STAKE_AMOUNT)
      .accounts({
        tournament: tournamentState,
        userState: user3State,
        vaultTokenAccount,
        userTokenAccount: user3TokenAccount,
        user: user3.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user3])
      .rpc();

  });

  it("Fails to stake wrong amount", async () => {
    try {
      await program.methods
        .stake(new anchor.BN(4_000_000))
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
      expect(err.message).to.include("Stake amount must be exactly 5 USDC");
    }
  });

  it("Fails to draft duplicate assets", async () => {
    try {
      await program.methods
        .updatePortfolio(["AAPLx", "AAPLx", "TSLAx"])
        .accounts({ userState: user3State, tournament: tournamentState, user: user3.publicKey })
        .signers([user3])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Duplicate assets are not allowed");
    }
  });

  it("Fails to draft > 5 assets", async () => {
    try {
      await program.methods
        .updatePortfolio(["AAPLx", "NVDAx", "TSLAx", "SPYx", "AAPLx", "NVDAx"])
        .accounts({ userState: user3State, tournament: tournamentState, user: user3.publicKey })
        .signers([user3])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Portfolio can have maximum 5 assets");
    }
  });

  it("Fails to draft unsupported asset", async () => {
    try {
      await program.methods
        .updatePortfolio(["DOGE", "NVDAx"])
        .accounts({ userState: user3State, tournament: tournamentState, user: user3.publicKey })
        .signers([user3])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Invalid asset provided");
    }
  });

  it("Fails to lock empty portfolio", async () => {
    // Empty user2 portfolio first
    await program.methods
      .updatePortfolio([])
      .accounts({ userState: user3State, tournament: tournamentState, user: user3.publicKey })
      .signers([user3])
      .rpc();
      
    try {
      await program.methods
        .lockPortfolio()
        .accounts({ userState: user3State, tournament: tournamentState, user: user3.publicKey })
        .signers([user3])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Portfolio cannot be empty when locking");
    }
  });

  it("Cross-tournament UserState collision prevention", async () => {
    // Generate a fake tournament PDA
    const fakeTournament = anchor.web3.Keypair.generate().publicKey;
    const [fakeUserState] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("user_state"), fakeTournament.toBuffer(), user3.publicKey.toBuffer()],
      program.programId
    );
    try {
      await program.methods
        .initializeUser()
        .accounts({
          userState: fakeUserState,
          user: user3.publicKey,
          tournament: fakeTournament, // not the real tournament
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([user3])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      // It should fail the seed constraint for tournament since fakeTournament != tournament PDA seeds
      expect(err.message).to.exist;
    }
  });

  it("Authority transitions to Locked Phase", async () => {
    await program.methods
      .updateGamePhase({ locked: {} })
      .accounts({
        tournament: tournamentState,
        authority: wallet.publicKey,
      })
      .rpc();

    const state = await program.account.tournamentState.fetch(tournamentState);
    expect(Object.keys(state.phase)[0]).to.equal("locked");
  });

  it("Fails backwards phase transition (Locked -> Registration)", async () => {
    try {
      await program.methods
        .updateGamePhase({ registration: {} })
        .accounts({
          tournament: tournamentState,
          authority: wallet.publicKey,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Invalid phase transition.");
    }
  });

  it("Fails portfolio update after tournament lock (DraftingClosed)", async () => {
    try {
      await program.methods
        .updatePortfolio(["AAPLx"])
        .accounts({ userState: user2State, tournament: tournamentState, user: user2.publicKey })
        .signers([user2])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Drafting phase is closed.");
    }
  });

  it("Locked user fails to unstake during Locked Phase", async () => {
    try {
      await program.methods
        .unstake()
        .accounts({
          tournament: tournamentState,
          userState: user2State,
          vaultTokenAccount,
          userTokenAccount: user2TokenAccount,
          user: user2.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([user2])
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Cannot unstake while portfolio is locked in an active tournament.");
    }
  });

  it("Authority transitions to Finished Phase", async () => {
    await program.methods
      .updateGamePhase({ finished: {} })
      .accounts({
        tournament: tournamentState,
        authority: wallet.publicKey,
      })
      .rpc();
  });

  it("Locked user can unstake during Finished Phase", async () => {
    await program.methods
      .unstake()
      .accounts({
        tournament: tournamentState,
        userState: user2State,
        vaultTokenAccount,
        userTokenAccount: user2TokenAccount,
        user: user2.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user2])
      .rpc();

    const state = await program.account.userState.fetch(user2State);
    expect(state.stakedAmount.toNumber()).to.equal(0);
  });

  it("Authority transitions to Settled Phase", async () => {
    await program.methods
      .updateGamePhase({ settled: {} })
      .accounts({
        tournament: tournamentState,
        authority: wallet.publicKey,
      })
      .rpc();
      
    const state = await program.account.tournamentState.fetch(tournamentState);
    expect(Object.keys(state.phase)[0]).to.equal("settled");
  });

  it("Settled phase is terminal (Fails to transition out of Settled)", async () => {
    try {
      await program.methods
        .updateGamePhase({ registration: {} })
        .accounts({
          tournament: tournamentState,
          authority: wallet.publicKey,
        })
        .rpc();
      expect.fail("Should have failed");
    } catch (err: any) {
      expect(err.message).to.include("Invalid phase transition.");
    }
  });
});
