# TradingView to Telegram Webhook 🚨📱

Get instant Telegram notifications when your TradingView Pine Script alerts trigger!

## ✅ What You Need

1. **Telegram Bot Token** (from @BotFather)
2. **Telegram Chat ID** (from @userinfobot)
3. Free hosting account (Vercel recommended)

---

## 📱 Step 1: Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send: `/newbot`
3. Choose a name: `TradingView Alerts`
4. Choose username: `mytradingalerts_bot` (or any unique name)
5. **Copy the Bot Token** (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

**Get Your Chat ID:**
1. Search for **@userinfobot** on Telegram
2. Start chat - it shows your Chat ID (e.g., `123456789`)
3. **Copy your Chat ID**

---

## 🚀 Step 2: Deploy (Choose ONE Method)

### Method A: Vercel (Recommended - Easiest)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd tradingview-telegram-webhook
   vercel
   ```

3. Follow prompts (login, confirm settings)

4. Set environment variables:
   ```bash
   vercel env add TELEGRAM_BOT_TOKEN
   # Paste your bot token

   vercel env add TELEGRAM_CHAT_ID
   # Paste your chat ID
   ```

5. Redeploy to apply env vars:
   ```bash
   vercel --prod
   ```

6. **Copy your webhook URL** (looks like `https://your-project.vercel.app`)

---

### Method B: Railway (Also Free & Easy)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Connect this repository
5. Add environment variables in Railway dashboard:
   - `TELEGRAM_BOT_TOKEN` = your bot token
   - `TELEGRAM_CHAT_ID` = your chat ID
6. **Copy your webhook URL** from Railway dashboard

---

### Method C: Render (Alternative)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect this repository
5. Settings:
   - Name: `tradingview-telegram`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables:
   - `TELEGRAM_BOT_TOKEN` = your bot token
   - `TELEGRAM_CHAT_ID` = your chat ID
7. Click "Create Web Service"
8. **Copy your webhook URL**

---

## 📊 Step 3: Configure TradingView

1. Open TradingView chart
2. Create your Pine Script alert:
   - Click "Alert" button (or Alt+A)
   - Set your conditions
   - In "Notifications" tab, check "Webhook URL"

3. **Webhook URL:** `https://your-webhook-url.com/webhook`
   - ⚠️ Don't forget the `/webhook` at the end!

4. **Alert Message (JSON format):**
   ```json
   {
     "symbol": "{{ticker}}",
     "action": "BUY",
     "price": "{{close}}",
     "time": "{{time}}",
     "interval": "{{interval}}",
     "strategy": "Your Strategy Name"
   }
   ```

   Or simple text:
   ```
   🚀 {{ticker}} - BUY signal at {{close}} on {{interval}} chart
   ```

5. Click "Create"

---

## ✅ Test It!

1. **Test the webhook directly:**
   ```bash
   curl -X POST https://your-webhook-url.com/webhook \
     -H "Content-Type: application/json" \
     -d '{"test": "This is a test alert", "price": "50000"}'
   ```

2. You should receive a Telegram message immediately!

3. **Test from TradingView:** Trigger your alert condition and check Telegram

---

## 📝 Customizing Alert Messages

Edit the `formatAlertMessage` function in `index.js` to customize how alerts appear in Telegram.

**Current format:**
```
🚨 TradingView Alert 🚨

symbol: BTCUSD
action: BUY
price: 50000
time: 2023-12-01 10:30

⏰ Timestamp
```

**You can add:**
- Emojis for different signal types (🟢 BUY, 🔴 SELL)
- Links to charts
- Price change percentages
- Custom formatting

---

## 🔧 Troubleshooting

**No messages received?**
- Check environment variables are set correctly
- Verify bot token with: `https://api.telegram.org/bot<YOUR_TOKEN>/getMe`
- Make sure webhook URL ends with `/webhook`
- Check logs in your hosting platform

**Alert not triggering?**
- Verify TradingView webhook URL is correct
- Check if alert condition is met
- Look at TradingView alert history

**Need help?**
- Test the health endpoint: `https://your-webhook-url.com/` (should return status)
- Check server logs in your hosting dashboard

---

## 💡 Advanced: Multiple Bots or Strategies

To send different strategies to different Telegram chats:

1. Create multiple bots
2. Use query parameters:
   ```
   https://your-webhook-url.com/webhook?strategy=momentum
   ```
3. Modify code to route based on strategy parameter

---

## 🎉 You're Done!

Your TradingView alerts will now instantly appear on your phone via Telegram!

**Pro Tips:**
- Test with a simple alert first
- Keep your bot token secret
- Use Telegram groups for team notifications
- Consider rate limits (Telegram allows ~30 messages/second)

Happy Trading! 📈🚀
