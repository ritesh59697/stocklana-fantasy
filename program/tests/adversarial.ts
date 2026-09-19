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

describe("stocklana-fantasy-adversarial", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.StocklanaFantasy as Program<StocklanaFantasy>;
  const wallet = provider.wallet as anchor.Wallet;

  // Static keypair for predictable USDC mint
  const usdcMintKeypair = anchor.web3.Keypair.generate();
  let usdcMint: anchor.web3.PublicKey = usdcMintKeypair.publicKey;
  
  // Fake mint to test mint substitution
  const fakeMintKeypair = anchor.web3.Keypair.generate();
  let fakeMint: anchor.web3.PublicKey = fakeMintKeypair.publicKey;

  let tournamentState: anchor.web3.PublicKey;
  let vaultTokenAccount: anchor.web3.PublicKey;

  let user1 = anchor.web3.Keypair.generate();
  let user1TokenAccount: anchor.web3.PublicKey;
  let user1FakeTokenAccount: anchor.web3.PublicKey;
  let user1State: anchor.web3.PublicKey;

  const STAKE_AMOUNT = new anchor.BN(5_000_000);

  before(async () => {
    // Airdrop SOL
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user1.publicKey, anchor.web3.LAMPORTS_PER_SOL)
    );

    usdcMint = await createMint(provider.connection, wallet.payer, wallet.publicKey, null, 6, usdcMintKeypair);
    fakeMint = await createMint(provider.connection, wallet.payer, wallet.publicKey, null, 6, fakeMintKeypair);

    [tournamentState] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("tournament")], program.programId);
    [vaultTokenAccount] = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("vault"), tournamentState.toBuffer()], program.programId);

    // Re-initialize for this suite (assuming a fresh localnet or we use a different tournament seed if we could, 
    // but the contract hardcodes b"tournament". We can't run this concurrently with the other suite without state collision on localnet, 
    // so we'll just run it as a separate file which will wipe local validator state if we run them sequentially via anchor test, 
    // wait anchor test doesn't wipe between files unless we configure it.
    // Let's just append these tests to the main program.ts file instead to avoid state issues!)
  });
});
