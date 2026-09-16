import { 
  Connection, 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  SystemProgram 
} from "@solana/web3.js";
import { 
  getAssociatedTokenAddressSync, 
  createAssociatedTokenAccountIdempotentInstruction, 
  TOKEN_PROGRAM_ID 
} from "@solana/spl-token";

export const PROGRAM_ID = new PublicKey("hGenhdu1tQPYJCvKF1XnemEV83eo1gQvp7LgcmRcway");
export const DEVNET_USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
export const STAKE_AMOUNT_USDC = 5; // 5 USDC
export const STAKE_RAW_AMOUNT = BigInt(STAKE_AMOUNT_USDC * 1_000_000); // 5,000,000

// Instruction Discriminators from Anchor IDL
const DISCRIMINATOR_INIT_USER = Buffer.from([111, 17, 185, 250, 60, 122, 38, 254]);
const DISCRIMINATOR_STAKE = Buffer.from([206, 176, 202, 18, 200, 209, 179, 108]);
const DISCRIMINATOR_UNSTAKE = Buffer.from([90, 95, 107, 42, 205, 124, 50, 225]);
const DISCRIMINATOR_UPDATE_PORTFOLIO = Buffer.from([0, 33, 180, 193, 28, 56, 215, 4]);

export function getUserStatePda(userPubkey: PublicKey): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("user_state"), userPubkey.toBuffer()],
    PROGRAM_ID
  );
  return pda;
}

export function getVaultTokenPda(): PublicKey {
  const [pda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault")],
    PROGRAM_ID
  );
  return pda;
}

/**
 * Builds the complete real on-chain staking transaction:
 * 1. Creates User's Devnet USDC ATA if not already created
 * 2. Initializes user_state PDA if first time
 * 3. Stakes 5 USDC into vault PDA
 */
export async function buildStakeTransaction(
  connection: Connection,
  wallet: any
): Promise<Transaction> {
  const userPubkey = wallet.publicKey;
  const userStatePda = getUserStatePda(userPubkey);
  const vaultTokenPda = getVaultTokenPda();
  const userAta = getAssociatedTokenAddressSync(DEVNET_USDC_MINT, userPubkey);

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
    const initIx = new TransactionInstruction({
      programId: PROGRAM_ID,
      keys: [
        { pubkey: userStatePda, isSigner: false, isWritable: true },
        { pubkey: userPubkey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: DISCRIMINATOR_INIT_USER,
    });
    tx.add(initIx);
  }

  // 3. Stake instruction: discriminator + 8 bytes u64 LE
  const stakeData = Buffer.alloc(16);
  DISCRIMINATOR_STAKE.copy(stakeData, 0);
  stakeData.writeBigUInt64LE(STAKE_RAW_AMOUNT, 8);

  const stakeIx = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: userStatePda, isSigner: false, isWritable: true },
      { pubkey: vaultTokenPda, isSigner: false, isWritable: true },
      { pubkey: userAta, isSigner: false, isWritable: true },
      { pubkey: userPubkey, isSigner: true, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: stakeData,
  });
  tx.add(stakeIx);

  tx.feePayer = userPubkey;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;

  return tx;
}

/**
 * Builds real transaction to record drafted portfolio on-chain
 */
export async function buildUpdatePortfolioTransaction(
  connection: Connection,
  wallet: any,
  stocks: string[]
): Promise<Transaction> {
  const userPubkey = wallet.publicKey;
  const userStatePda = getUserStatePda(userPubkey);

  const tx = new Transaction();

  // Borsh serialize Vec<String>:
  // 8 bytes discriminator + 4 bytes length + for each string (4 bytes len + bytes)
  const safeStocks = stocks.slice(0, 5);
  let payloadSize = 8 + 4;
  for (const s of safeStocks) {
    payloadSize += 4 + Buffer.byteLength(s, "utf8");
  }

  const data = Buffer.alloc(payloadSize);
  DISCRIMINATOR_UPDATE_PORTFOLIO.copy(data, 0);
  data.writeUInt32LE(safeStocks.length, 8);
  let offset = 12;
  for (const s of safeStocks) {
    const sBytes = Buffer.from(s, "utf8");
    data.writeUInt32LE(sBytes.length, offset);
    offset += 4;
    sBytes.copy(data, offset);
    offset += sBytes.length;
  }

  const updateIx = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: userStatePda, isSigner: false, isWritable: true },
      { pubkey: userPubkey, isSigner: true, isWritable: false },
    ],
    data,
  });
  tx.add(updateIx);

  tx.feePayer = userPubkey;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;

  return tx;
}

/**
 * Builds real transaction to unstake 5 USDC
 */
export async function buildUnstakeTransaction(
  connection: Connection,
  wallet: any
): Promise<Transaction> {
  const userPubkey = wallet.publicKey;
  const userStatePda = getUserStatePda(userPubkey);
  const vaultTokenPda = getVaultTokenPda();
  const userAta = getAssociatedTokenAddressSync(DEVNET_USDC_MINT, userPubkey);

  const tx = new Transaction();

  const unstakeData = Buffer.alloc(16);
  DISCRIMINATOR_UNSTAKE.copy(unstakeData, 0);
  unstakeData.writeBigUInt64LE(STAKE_RAW_AMOUNT, 8);

  const unstakeIx = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: userStatePda, isSigner: false, isWritable: true },
      { pubkey: vaultTokenPda, isSigner: false, isWritable: true },
      { pubkey: userAta, isSigner: false, isWritable: true },
      { pubkey: userPubkey, isSigner: true, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: unstakeData,
  });
  tx.add(unstakeIx);

  tx.feePayer = userPubkey;
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;

  return tx;
}
