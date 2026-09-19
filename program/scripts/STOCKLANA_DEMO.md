# Stocklana Fantasy Product Demo Walkthrough
# Executed by chrome-demo-pilot on real Google Chrome with smooth bezier arcs & callouts

# 1. Open Stocklana Fantasy Demo Sandbox
goto http://localhost:3000/?mockWallet=true
wait 2000

# 2. Callout: Introduction & 100k Capital
callout "Stocklana Fantasy: Zero-Loss Tokenized Equities on Solana" 3000
wait 3000

callout "Connected: $100,000 Virtual Purchasing Power Credited" 2500
wait 2500

# 3. Callout: Protocol Architecture
click text=How It Works "Reviewing Protocol Architecture"
wait 3500

click text=Enter Tournament "Entering Arena"
wait 1500

# 4. Draft Allocation: Equal Split across Token-2022 Equities
callout "Drafting Tokenized Equities: AAPLx, NVDAx, TSLAx, SPYx" 2500
wait 2000

click text=Equal Split "Auto-Balancing $100k Portfolio"
wait 2500

# 5. Review Draft & Stake 5 USDC Collateral
scroll 350
wait 1500

callout "Staking 5 USDC into Anchor Smart Vault..." 2500
click text=Stake 5 USDC & Lock Draft "Staking 5 USDC & Locking Draft"
wait 3500

# 6. Verify On-Chain Receipt
callout "Draft Locked! On-Chain Signature & Zero-Loss Guarantee" 3000
wait 3000

click text=View Live Leaderboard "Viewing Tournament Standings"
wait 2000

# 7. Portfolio Performance & Live Leaderboard
scroll 0
wait 1500

callout "Active Roster: Tracking PnL & Yield Accrual Live" 3000
wait 3000

scroll 250
wait 2000

callout "Live Leaderboard: Real-Time Valuation Rankings" 3000
wait 3000

# 8. Zero-Loss Unstake Demonstration
scroll 500
wait 1500

callout "Testing Zero-Loss Guarantee: Instant 5 USDC Refund" 2500
click text=Unstake 5 USDC "Refunding Collateral from Anchor Vault"
wait 3500

callout "Full $5.00 USDC Principal Restored to Wallet!" 3000
wait 2000
