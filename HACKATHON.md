# HACKATHON

- **Deadline:** Sept 18, 2026 (7 days remaining)
- **Tracks:** Stock market on Solana
- **Required Deliverables:** Demo video, Live link, README, Repo
- **Idea log:**
  - Fantasy Wall Street (Selected)
  - AI Sentiment Hedge Fund (Killed - chose #1)
  - Payroll in Equity (Killed - chose #1)

1. **Demo Script:** User connects wallet -> sees prize pool -> Stakes 5 USDC to play -> Receives 100k Fantasy Dollars -> Drafts AAPLx, NVDAx, TSLAx, SPYx using Pyth prices -> Live leaderboard shows portfolio value updating real-time against others -> User unstakes 5 USDC (zero loss). [COMPLETED ✅]
2. **Scope Cuts:** 
   - No real DeFi yield routing for v1 demo (mock yield or simple hold in vault PDA).
   - Pyth is used in the frontend for live pricing, but NOT ingested by the Anchor contract.
   - Leaderboard and Settlement are administered off-chain / simulated in UI for the demo.
   - No mobile UI, no historical charts, no complex auth.
3. **Money Shot:** The Live Leaderboard ticking in real-time based on Pyth stock prices. [COMPLETED ✅]
4. **Timebox Progress:**
   - [x] Day 1-2: Anchor Smart Contract (`program/programs/program/src/lib.rs` - `initialize_user`, `stake`, `unstake`, `update_portfolio`)
   - [x] Day 3-4: Frontend Foundation (Next.js Action Cockpit, Solana Wallet Adapter, Token-2022 xStocks integration)
   - [x] Day 5-6: Money Shot (Pyth Oracles + Live Ticking Leaderboard + Receipt Modal + Zero-Loss Unstake)
   - [ ] Day 7: Record 2.5-min Demo Video (Script in README.md) & Submit
5. **Stack:** Next.js 16 (Turbopack), Tailwind CSS, Anchor (Rust), Pyth Network SDK, Solana Wallet Adapter.
