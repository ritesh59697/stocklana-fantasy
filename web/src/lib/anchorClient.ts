import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram 
} from "@solana/web3.js";
import { 
  getAssociatedTokenAddressSync, 
  createAssociatedTokenAccountIdempotentInstruction, 
  TOKEN_PROGRAM_ID 
} from "@solana/spl-token";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import IDL from "./stocklana_fantasy.json";

export const PROGRAM_ID = new PublicKey("hGenhdu1tQPYJCvKF1XnemEV83eo1gQvp7LgcmRcway");
export const DEVNET_USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
export const STAKE_AMOUNT_USDC = 5; // 5 USDC
export const STAKE_RAW_AMOUNT = new anchor.BN(STAKE_AMOUNT_USDC * 1_000_000); // 5,000,000

export function getTournamentStatePda(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("tournament")],
    PROGRAM_ID
  );
  return pda;
}

export function getUserStatePda(userPubkey: PublicKey, tournamentStatePda: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_state"), tournamentStatePda.toBuffer(), userPubkey.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getVaultTokenPda(): PublicKey {
  const tournamentStatePda = getTournamentStatePda();
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), tournamentStatePda.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

// Helper to get a detached Program instance for transaction building
function getProgram(connection: Connection): Program {
  const provider = new anchor.AnchorProvider(connection, {} as any, { commitment: "confirmed" });
  return new Program(IDL as any, provider);
}

export async function buildStakeTransaction(
  connection: Connection,
  wallet: any,
  stocks?: string[]
): Promise<Transaction> {
  const userPubkey = wallet.publicKey;
  const tournamentStatePda = getTournamentStatePda();
  const userStatePda = getUserStatePda(userPubkey, tournamentStatePda);
  const vaultTokenPda = getVaultTokenPda();
  const userAta = getAssociatedTokenAddressSync(DEVNET_USDC_MINT, userPubkey);
  
  const program = getProgram(connection);
  const tx = new Transaction();

  // 1. Ensure user's USDC ATA exists
  const userAtaInfo = await connection.getAccountInfo(userAta);
  if (!userAtaInfo) {
    tx.add(
      createAssociatedTokenAccountIdempotentInstruction(
        userPubkey,
        userAta,
        userPubkey,
        DEVNET_USDC_MINT
      )
    );
  }

  // 2. Check if user_state account exists
  const userStateInfo = await connection.getAccountInfo(userStatePda);
  if (!userStateInfo) {
    const initUserIx = await program.methods.initializeUser().accounts({
      userState: userStatePda,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
    }).instruction();
    tx.add(initUserIx);
  }

  // 3. Stake instruction
  const stakeIx = await program.methods.stake(STAKE_RAW_AMOUNT).accounts({
    tournament: tournamentStatePda,
    userState: userStatePda,
    vaultTokenAccount: vaultTokenPda,
    userTokenAccount: userAta,
    user: userPubkey,
    tokenProgram: TOKEN_PROGRAM_ID,
  }).instruction();
  tx.add(stakeIx);

  // 4. If drafted stocks are provided, atomically update portfolio in the same transaction
  if (stocks && stocks.length > 0) {
    const safeStocks = stocks.slice(0, 5);
    const updateIx = await program.methods.updatePortfolio(safeStocks).accounts({
      userState: userStatePda,
      tournament: tournamentStatePda,
      user: userPubkey,
    }).instruction();
    tx.add(updateIx);
    
    const lockIx = await program.methods.lockPortfolio().accounts({
      userState: userStatePda,
      tournament: tournamentStatePda,
      user: userPubkey,
    }).instruction();
    tx.add(lockIx);
  }

  tx.feePayer = userPubkey;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;

  return tx;
}

export async function buildUpdateAndLockPortfolioTransaction(
  connection: Connection,
  wallet: any,
  stocks: string[]
): Promise<Transaction> {
  const userPubkey = wallet.publicKey;
  const tournamentStatePda = getTournamentStatePda();
  const userStatePda = getUserStatePda(userPubkey, tournamentStatePda);
  const program = getProgram(connection);

  const tx = new Transaction();
  
  const safeStocks = stocks.slice(0, 5);
  const updateIx = await program.methods.updatePortfolio(safeStocks).accounts({
    userState: userStatePda,
    tournament: tournamentStatePda,
    user: userPubkey,
  }).instruction();
  tx.add(updateIx);

  const lockIx = await program.methods.lockPortfolio().accounts({
    userState: userStatePda,
    tournament: tournamentStatePda,
    user: userPubkey,
  }).instruction();
  tx.add(lockIx);

  tx.feePayer = userPubkey;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;

  return tx;
}

export async function buildLockPortfolioTransaction(
  connection: Connection,
  wallet: any
): Promise<Transaction> {
  const userPubkey = wallet.publicKey;
  const tournamentStatePda = getTournamentStatePda();
  const userStatePda = getUserStatePda(userPubkey, tournamentStatePda);
  const program = getProgram(connection);

  const tx = new Transaction();
  
  const lockIx = await program.methods.lockPortfolio().accounts({
    userState: userStatePda,
    tournament: tournamentStatePda,
    user: userPubkey,
  }).instruction();
  tx.add(lockIx);

  tx.feePayer = userPubkey;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;

  return tx;
}

export async function buildUnstakeTransaction(
  connection: Connection,
  wallet: any
): Promise<Transaction> {
  const userPubkey = wallet.publicKey;
  const tournamentStatePda = getTournamentStatePda();
  const userStatePda = getUserStatePda(userPubkey, tournamentStatePda);
  const vaultTokenPda = getVaultTokenPda();
  const userAta = getAssociatedTokenAddressSync(DEVNET_USDC_MINT, userPubkey);
  
  const program = getProgram(connection);
  const tx = new Transaction();

  const unstakeIx = await program.methods.unstake().accounts({
    tournament: tournamentStatePda,
    userState: userStatePda,
    vaultTokenAccount: vaultTokenPda,
    userTokenAccount: userAta,
    user: userPubkey,
    tokenProgram: TOKEN_PROGRAM_ID,
  }).instruction();
  tx.add(unstakeIx);

  tx.feePayer = userPubkey;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;

  return tx;
}

export async function fetchUserState(
  connection: Connection,
  wallet: any
): Promise<{ hasStaked: boolean, isLocked: boolean, portfolio: string[], hasEntered: boolean } | null> {
  if (!wallet.publicKey) return null;
  const program = getProgram(connection);
  const tournamentStatePda = getTournamentStatePda();
  const userStatePda = getUserStatePda(wallet.publicKey, tournamentStatePda);
  
  try {
    const state = await (program.account as any).userState.fetch(userStatePda);
    return {
      hasStaked: (state.stakedAmount as anchor.BN).toNumber() > 0,
      isLocked: state.isLocked,
      portfolio: state.portfolio,
      hasEntered: state.hasEntered,
    };
  } catch (e) {
    return null;
  }
}
