# 💰 Modern Expense Tracker

A beautiful, premium, and feature-rich personal finance application built with **Next.js**, **Prisma**, and **NextAuth**. Designed with a stunning, iOS-inspired glassmorphic UI, custom typography, and dynamic animations.

### 🚀 Live Demo
**[expensetracker-git-main-scriptech.vercel.app](https://expensetracker-git-main-scriptech.vercel.app/)**

---

## ✨ Features

* **Premium UI/UX**: Frosted glass effects, dynamic modals, fluid animations, and a sleek custom typography system ("Eightgon").
* **OAuth Authentication**: Secure Google Sign-In powered by NextAuth.js.
* **Global Add Modal**: Instantly log Income or Expenses from anywhere in the app with a single tap.
* **Smart Categorization**: Log expenses using a strict, hierarchical category system (e.g., Food -> Groceries).
* **Comprehensive Tracking**:
  * **Daily Expenses & Incomes**: Track cash flow instantly.
  * **Credit Cards**: Track multiple cards, outstanding balances, and EMIs.
  * **Loans (Flexi-loans)**: Advanced tracking for traditional loans and flexi-loans (interest-only periods transitioning to full EMIs).
  * **Investments & Retirement**: Log multiple deposits and withdrawals across your investment portfolio.
* **Dynamic Dashboard**: Auto-calculates your current month's expenses, incomes, and upcoming EMIs in one centralized view.
* **Global Preferences**: Change currency symbols globally and customize your user profile.

---

## 🛠 Tech Stack

* **Framework**: Next.js 14 (App Router)
* **Language**: TypeScript
* **Styling**: Vanilla CSS (CSS Modules & Variables) + Glassmorphism
* **Database**: SQLite (Local) / PostgreSQL (Production on Vercel)
* **ORM**: Prisma
* **Authentication**: NextAuth.js (Google OAuth)
* **Icons**: Lucide React

---

## 💻 Running Locally

To run this project on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd expensetracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your_nextauth_secret_here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 4. Setup Database
Run the following Prisma command to push the schema to your local SQLite database and generate the Prisma Client:
```bash
npx prisma db push
```

### 5. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## ☁️ Deployment (Vercel)

This project is optimized for deployment on Vercel. 
During the Vercel build step, the `package.json` dynamically switches the Prisma provider from SQLite to PostgreSQL. 
Make sure you provide a valid Postgres `DATABASE_URL` in your Vercel project settings!

```json
"build": "if [ \"$VERCEL\" = \"1\" ]; then sed -i 's/provider = \"sqlite\"/provider = \"postgresql\"/g' prisma/schema.prisma && prisma generate && npx prisma db push --accept-data-loss; else prisma generate; fi && next build"
```
