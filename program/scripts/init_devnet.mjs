import { Connection, Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import anchor from "@coral-xyz/anchor";
import fs from "fs";

const PROGRAM_ID = new PublicKey("hGenhdu1tQPYJCvKF1XnemEV83eo1gQvp7LgcmRcway");
const DEVNET_USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
const RPC_URL = "https://devnet.helius-rpc.com/?api-key=2abd1ade-2fc8-409a-b804-2c0e3a486e54";

async function main() {
  const connection = new Connection(RPC_URL, "confirmed");
  const keypairPath = `${process.env.HOME}/.config/solana/id.json`;
  const secretKey = JSON.parse(fs.readFileSync(keypairPath, "utf8"));
  const authority = Keypair.fromSecretKey(new Uint8Array(secretKey));

  console.log("Authority:", authority.publicKey.toBase58());
  const balance = await connection.getBalance(authority.publicKey);
  console.log("Authority balance:", balance / 1e9, "SOL");

  const idl = JSON.parse(fs.readFileSync("./target/idl/stocklana_fantasy.json", "utf8"));
  const wallet = new anchor.Wallet(authority);
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
  const program = new anchor.Program(idl, provider);

  const [tournamentPda] = PublicKey.findProgramAddressSync([Buffer.from("tournament")], PROGRAM_ID);
  const [vaultPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), tournamentPda.toBuffer()],
    PROGRAM_ID
  );

  console.log("Tournament PDA:", tournamentPda.toBase58());
  console.log("Vault PDA:", vaultPda.toBase58());

  // 1. Initialize Tournament if not exists
  const tourInfo = await connection.getAccountInfo(tournamentPda);
  if (!tourInfo) {
    console.log("Initializing Tournament on Devnet...");
    const tx = await program.methods
      .initializeTournament()
      .accounts({
        tournament: tournamentPda,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("Tournament initialized! Tx:", tx);
  } else {
    console.log("Tournament already initialized.");
  }

  // 2. Initialize Vault if not exists
  const vaultInfo = await connection.getAccountInfo(vaultPda);
  if (!vaultInfo) {
    console.log("Initializing Vault on Devnet...");
    const tx = await program.methods
      .initializeVault()
      .accounts({
        vaultTokenAccount: vaultPda,
        usdcMint: DEVNET_USDC_MINT,
        authority: authority.publicKey,
        tournament: tournamentPda,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .rpc();
    console.log("Vault initialized! Tx:", tx);
  } else {
    console.log("Vault already initialized.");
  }

  console.log("Devnet initialization complete!");
}

main().catch((err) => {
  console.error("Initialization error:", err);
  process.exit(1);
});
