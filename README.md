# SautiLeja - AI Financial Management for Women Entrepreneurs

## Overview

SautiLeja is a mobile-first financial management platform designed specifically for women entrepreneurs in informal businesses across East Africa. The platform enables users to track sales, manage inventory, and receive AI-powered business insights—all in their preferred language (English, Kiswahili, or Sheng).

## Key Features

### 🎤 Voice Transaction Recording
- Record transactions using your voice
- Multilingual support (English, Kiswahili, Sheng)
- Automatic transaction extraction from voice input
- No need to remember exact amounts or products

### 📊 Dashboard & Analytics
- Real-time sales metrics (daily, weekly, monthly)
- Visual charts and graphs
- AI-generated business insights
- Low stock alerts

### 📦 Inventory Management
- Track product stock levels
- Manage cost and selling prices
- Calculate profit margins
- Restock reminders for low-stock items

### 🤖 SautiBot AI Assistant
- Ask questions about your business
- Get recommendations to improve sales
- Understand profitability
- Optimize inventory management

### 📄 Reports & Export
- Generate sales reports
- Create inventory reports
- Export profitability analysis
- Download as text or CSV files

## Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Storage**: Browser localStorage (MVP)
- **Language**: TypeScript
- **Multilingual**: Custom translation system

## Project Structure

```
src/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Landing page
│   ├── dashboard/               # Dashboard
│   ├── transactions/            # Transaction management
│   ├── inventory/               # Inventory management
│   ├── insights/                # Analytics & insights
│   ├── sautibot/                # AI chat assistant
│   ├── reports/                 # Report generation
│   ├── pricing/                 # Pricing plans
│   ├── login/                   # Authentication
│   └── register/                # User registration
├── components/                   # Reusable components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Chart.tsx
│   ├── FormField.tsx
│   ├── LanguageSelector.tsx
│   ├── Metric.tsx
│   └── Navbar.tsx
├── lib/                          # Utility functions
│   ├── translations.ts           # i18n strings
│   ├── localStorage.ts           # Data persistence
│   ├── aiUtils.ts                # AI logic
│   └── voiceUtils.ts             # Voice processing
├── globals.css                   # Global styles
└── globals.d.ts                  # TypeScript definitions
```

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sautileja-maker/Sauti-.git
cd Sauti-
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Register a New Account
1. Click "Sign Up" on the landing page
2. Enter your details (name, email, business type)
3. Set a password and confirm it
4. You'll be automatically logged in and redirected to the dashboard

### Record a Transaction
1. Go to **Transactions** → **Record Voice Transaction**
2. Click the microphone icon to record
3. Say something like "Sold 10 tomatoes for 500 shillings"
4. Review and save the transaction

### Manage Inventory
1. Go to **Inventory**
2. Add new products with cost and selling prices
3. Track stock levels
4. View profit margins

### View Analytics
1. Go to **Insights**
2. See your sales trends and revenue metrics
3. Identify best-selling products
4. Get AI-powered recommendations

### Chat with SautiBot
1. Go to **SautiBot**
2. Ask questions like:
   - "How are my sales trending?"
   - "Which products are most profitable?"
   - "What should I restock?"

### Generate Reports
1. Go to **Reports**
2. Select report type (Sales, Inventory, Profitability)
3. Click "Generate Report"
4. Download as text file

## Pricing Plans

### Free Plan
- Basic transaction tracking
- Manual entry only
- Simple inventory management
- Up to 100 transactions/month
- Limited AI insights

### Pro Plan (KES 499/month)
- Voice transaction recording
- Advanced AI insights
- SautiBot assistant
- Unlimited transactions
- Generate reports (PDF, CSV)
- Priority support

### Business Plan (KES 999/month)
- Everything in Pro
- Multi-user access
- Team management
- Advanced reporting
- Custom integrations
- API access

## Languages Supported

- 🇬🇧 English
- 🇰🇪 Kiswahili
- 🏙️ Sheng (Kenyan urban slang)

Users can switch languages anytime from the language selector in the top navigation.

## Features Coming Soon

- Mobile app (iOS/Android)
- SMS-based transaction logging
- Integration with M-Pesa for payments
- Expense tracking
- Financial projections
- Credit scoring for microfinance
- Integration with suppliers
- WhatsApp bot support

## Data Storage

Currently, the MVP uses browser localStorage for data persistence. This means:
- Data is stored locally on each device
- Data persists across browser sessions
- Data is not synced across devices

Future versions will include cloud sync and backup.

## Security

- Passwords are hashed (will implement proper hashing in production)
- All data is stored locally
- No sensitive data sent to external servers (MVP)
- HTTPS will be enforced in production

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please email support@sautileja.com or create an issue in the GitHub repository.

## Authors

- **Sauti Team** - Initial work and vision
- **Contributors** - [Your name here]

## Roadmap

- [ ] Backend API development
- [ ] Cloud database integration
- [ ] Real voice-to-text API integration
- [ ] Mobile app launch
- [ ] Payment integration (M-Pesa, cards)
- [ ] Group features (cooperatives)
- [ ] Advanced AI predictions
- [ ] Integration with financial institutions

---

**Empowering women entrepreneurs through financial technology** 💪
