Take-Home Technical Assessment — Dynamic Financial Modeling MVP
Objective
Build a functional web MVP that performs a Discounted Cash Flow (DCF) valuation for the FAANG
companies (Apple, Amazon, Meta, Netflix, Alphabet). The user should be able to change key
assumptions and see valuations update in real time.
Suggested stack (optional):
- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui components
- Serverless (no backend required)
- If needed, store mock data in the front end
You may optionally use Structify’s API to fetch real company financials. If the API does not return all
fields, fall back to provided mock data.
Financial Concepts (with Copy-Ready Formulas)
(1) Free Cash Flow (FCF)
FCF = EBIT × (1 – Tax Rate) + Depreciation & Amortization – Capital Expenditures – Change in Net
Working Capital
(2) Cost of Equity (CAPM)
Cost of Equity = Risk-Free Rate + Beta × Equity Risk Premium
(3) WACC (Weighted Average Cost of Capital)
WACC = (Equity/(Debt + Equity)) × Cost of Equity
+ (Debt/(Debt + Equity)) × Cost of Debt × (1 – Tax Rate)
(4) Terminal Value (Perpetual Growth Method)
Terminal Value = FCF in Final Forecast Year × (1 + Terminal Growth Rate) / (WACC – Terminal
Growth Rate)
(5) Present Value of Cash Flows
PV of FCF = FCF in Year N / (1 + WACC)^N
(6) Enterprise Value (EV)
Enterprise Value = Sum of Present Value of Forecasted FCFs + Present Value of Terminal Value
(7) Equity Value
Equity Value = Enterprise Value – Net Debt
(8) Implied Price Per Share
Price Per Share = Equity Value / Shares Outstanding
Data Requirements
For each FAANG company, retrieve (via API or mock data):
- Revenue (most recent, or last 5 years)
- EBIT
- Depreciation & amortization
- Capital expenditures
- Change in net working capital
- Shares outstanding
- Cash balance
- Total debt balance
Forecast and Assumptions
Create a 5-year forecast with adjustable user inputs:
- Revenue growth rate
- EBIT margin
- Effective tax rate
- Depreciation & amortization as a % of revenue
- Capital expenditures as a % of revenue
- Change in net working capital as a % of revenue
- WACC
- Terminal growth rate
Application Requirements
The application should:
1. Allow selecting a company.
2. Display user-editable assumption inputs.
3. Recalculate all valuation outputs dynamically.
4. Show revenue, EBIT, FCF forecast, discounted FCFs, terminal value, EV, equity value, implied
share price.
5. Provide a small sensitivity view (WACC vs. terminal growth).
Deliverable
Submit a GitHub repository link or a deployed demo link (Vercel preferred).
Run with:
npm install
npm run dev
Evaluation Criteria
- Accuracy of financial logic
- Code quality and organization
- UI clarity and usability
- Handling of missing/partial data
- Overall polish and completeness
