require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(express.text());

// Environment variables (set these in your hosting platform)
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Function to send message to Telegram
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data);
      throw new Error(data.description || 'Failed to send message');
    }

    return data;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    throw error;
  }
}

// Format the alert message nicely
function formatAlertMessage(alertData) {
  let message = '🚨 <b>TradingView Alert</b> 🚨\n\n';

  // If alertData is a string, try to parse it
  if (typeof alertData === 'string') {
    try {
      alertData = JSON.parse(alertData);
    } catch (e) {
      // If not JSON, just use the raw string
      message += alertData;
      return message;
    }
  }

  // Format the alert nicely
  if (typeof alertData === 'object') {
    for (const [key, value] of Object.entries(alertData)) {
      message += `<b>${key}:</b> ${value}\n`;
    }
  } else {
    message += alertData;
  }

  message += `\n⏰ <i>${new Date().toLocaleString()}</i>`;

  return message;
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'active',
    message: 'TradingView to Telegram webhook is running!',
    timestamp: new Date().toISOString()
  });
});

// Webhook endpoint - receives alerts from TradingView
app.post('/webhook', async (req, res) => {
  console.log('Received webhook:', req.body);

  // Check if Telegram credentials are configured
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Missing Telegram credentials');
    return res.status(500).json({
      error: 'Server not configured properly. Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.'
    });
  }

  try {
    // Get the alert data from request body
    const alertData = req.body;

    // Format and send the message
    const message = formatAlertMessage(alertData);
    await sendTelegramMessage(message);

    console.log('Alert sent to Telegram successfully');
    res.json({
      success: true,
      message: 'Alert sent to Telegram'
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({
      error: 'Failed to send alert',
      details: error.message
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running on port ${PORT}`);
  console.log(`📱 Ready to receive TradingView alerts and forward to Telegram`);

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('⚠️  WARNING: Telegram credentials not set!');
    console.warn('   Please set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID environment variables');
  }
});
