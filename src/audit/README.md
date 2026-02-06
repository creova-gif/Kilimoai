# 🔍 KILIMO Automated Audit System

Comprehensive automated testing and quality assurance system for the KILIMO Agri-AI Suite.

## 🎯 Features

- **API Endpoint Testing** - Tests all 58 backend endpoints
- **Workflow Validation** - Validates 5 critical user workflows
- **AI Prompt Testing** - Tests AI responses and quality
- **Localization Checks** - Validates English/Swahili translations
- **Role-Based Access** - Tests all 7 user roles
- **Payment Integration** - Validates M-Pesa, Cards, etc.
- **Automated Reporting** - Generates JSON and HTML reports

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Access to KILIMO backend (staging or production)

## 🚀 Installation

```bash
cd audit
npm install
```

## ⚙️ Configuration

1. Copy environment variables:

```bash
cp .env.example .env
```

2. Edit `.env` with your configuration:

```env
NODE_ENV=development
API_BASE_URL=https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7
FRONTEND_URL=https://your-kilimo-app.vercel.app
SUPABASE_ANON_KEY=your_anon_key
```

3. Update `config.js` with your test users and endpoints

## 🏃 Usage

### Basic Audit (Full Test Suite)

```bash
npm run audit
```

This runs all tests with browser visible. Takes ~10-15 minutes.

### Quick Audit (Essential Tests Only)

```bash
npm run audit:quick
```

Runs critical tests only. Takes ~3-5 minutes.

### Headless Mode (CI/CD)

```bash
npm run audit:headless
```

Runs in headless mode (no browser window). Perfect for CI/CD pipelines.

### Test Specific Role

```bash
npm run audit:role -- --role=smallholder_farmer
```

Tests only specific user role.

### CI/CD Pipeline

```bash
npm run audit:ci
```

Runs quick audit in headless mode. Exits with code 0 (success) or 1 (failure).

## 📊 Test Coverage

### API Endpoints (58 total)

- ✅ Authentication (6 endpoints)
- ✅ Wallet (5 endpoints)
- ✅ Payments (4 endpoints)
- ✅ Tasks (4 endpoints)
- ✅ AI Services (5 endpoints)
- ✅ Alerts & Notifications (5 endpoints)
- ✅ Marketplace (6 endpoints)
- ✅ Crop Planning (4 endpoints)
- ✅ Livestock (4 endpoints)
- ✅ Weather & Market (4 endpoints)
- ✅ Learning (3 endpoints)
- ✅ Experts (4 endpoints)
- ✅ Farm Management (2 endpoints)

### Critical Workflows (5 total)

1. **AI Chat → Task Creation** - AI recommendation creates actionable task
2. **Crop Diagnosis → Treatment Task** - Image analysis creates health task
3. **Weather Alert → Protective Task** - Extreme weather triggers action
4. **Deposit → Wallet Update** - Payment flow credits wallet
5. **Withdrawal → Balance Deduction** - Payout flow deducts correctly

### AI Prompts (5+ tested)

- Crop planting advice (English & Swahili)
- Pest identification
- Fertilizer recommendations
- Market price queries
- Weather interpretation

### User Roles (7 total)

- Smallholder Farmer
- Farmer
- Farm Manager
- Commercial Farm Admin
- Agribusiness Operations
- Extension Officer/NGO
- Cooperative Leader

## 📈 Reports

Reports are generated in `./audit-reports/` directory:

- **JSON Report** - `audit-report-YYYY-MM-DD.json` - Machine-readable results
- **HTML Report** - `audit-report-YYYY-MM-DD.html` - Human-readable dashboard
- **Screenshots** - Captured on test failures (in `./screenshots/`)

### Example Report Structure

```json
{
  "metadata": {
    "timestamp": "2026-01-27T10:00:00Z",
    "environment": "production",
    "duration": 480
  },
  "summary": {
    "totalTests": 150,
    "passed": 142,
    "failed": 8,
    "warnings": 5,
    "successRate": "94.7"
  },
  "apiTests": { ... },
  "workflowTests": { ... },
  "aiPromptTests": { ... },
  "recommendations": [ ... ]
}
```

## 🎯 Success Criteria

The audit passes if:

- ✅ API success rate ≥ 90%
- ✅ Critical API success rate = 100%
- ✅ Workflow success rate ≥ 85%
- ✅ Critical workflow success rate = 100%
- ✅ AI prompt success rate ≥ 80%
- ✅ Localization coverage ≥ 70%

## 🔧 Troubleshooting

### "Connection refused" errors

- Verify `API_BASE_URL` is correct
- Check if backend is running
- Verify authentication token

### "Timeout" errors

- Increase timeout in `config.js`
- Check network connection
- Verify backend response times

### "Element not found" errors

- Update selectors in `test-utils.js`
- Verify frontend deployment
- Check if UI has changed

### Puppeteer installation issues

```bash
# Install Chromium dependencies (Linux)
sudo apt-get install -y \
  libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libxkbcommon0 libxcomposite1 \
  libxdamage1 libxrandr2 libgbm1 \
  libasound2

# Or use existing Chrome
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: KILIMO Audit

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * *' # Daily at 6 AM

jobs:
  audit:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd audit
          npm install
      
      - name: Run audit
        env:
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
          FRONTEND_URL: ${{ secrets.FRONTEND_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        run: |
          cd audit
          npm run audit:ci
      
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: audit-report
          path: audit/audit-reports/
      
      - name: Notify on failure
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'KILIMO audit failed!'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### GitLab CI

```yaml
audit:
  stage: test
  image: node:18
  before_script:
    - cd audit
    - npm install
  script:
    - npm run audit:ci
  artifacts:
    when: always
    paths:
      - audit/audit-reports/
    expire_in: 7 days
  only:
    - main
    - staging
```

## 📧 Notifications

### Email Reports

Configure in `config.js`:

```javascript
report: {
  sendEmail: true,
  emailRecipients: ['admin@kilimo.app', 'qa@kilimo.app']
}
```

Requires email service configuration in `report-generator.js`.

### Slack Integration

```bash
# Send report to Slack webhook
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d @audit/audit-reports/audit-report-latest.json
```

## 🧪 Writing Custom Tests

### Add API Endpoint Test

Edit `config.js`:

```javascript
apiEndpoints: [
  // ... existing endpoints
  { 
    path: '/your-new-endpoint/:userId', 
    method: 'GET', 
    requiresAuth: true, 
    critical: false 
  }
]
```

### Add Workflow Test

Edit `config.js`:

```javascript
workflows: [
  // ... existing workflows
  {
    name: 'your_workflow',
    description: 'Description of your workflow',
    steps: [
      { action: 'navigate', data: { url: '/page' } },
      { action: 'click', selector: '#button' },
      { action: 'verify', check: 'result.success' }
    ],
    critical: false
  }
]
```

### Add AI Prompt Test

Edit `config.js`:

```javascript
aiPrompts: [
  // ... existing prompts
  {
    name: 'your_prompt',
    prompt: 'Your question to AI',
    expectedKeywords: ['keyword1', 'keyword2'],
    language: 'en'
  }
]
```

## 📚 Documentation

- [API Documentation](../docs/API.md)
- [Workflow Guide](../docs/WORKFLOWS.md)
- [QA Test Report](../QA_TEST_REPORT_COMPREHENSIVE.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/audit-improvement`)
3. Commit your changes (`git commit -m 'Add new test'`)
4. Push to the branch (`git push origin feature/audit-improvement`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:

- Create an issue on GitHub
- Email: support@kilimo.app
- Slack: #kilimo-qa

## 🎉 Credits

Built with ❤️ by CREOVA for the KILIMO Agri-AI Suite

---

**Last Updated:** January 27, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
