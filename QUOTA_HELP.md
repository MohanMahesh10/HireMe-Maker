# 🚨 Gemini API Quota Issues - Quick Fix Guide

## ❌ Error: "API quota exceeded or billing issue"

### 🔧 **Immediate Solutions:**

1. **Wait 5-10 minutes** - Quotas reset every hour
2. **Try a different API key** - Create a new one from Google AI Studio
3. **Check your usage** - Go to Google AI Studio > Settings

### 🆓 **Free Tier Limits (Per Day):**
- **15 requests per minute**
- **1,500 requests per day** 
- **1 million tokens per day**

### 💡 **Quick Fixes:**

#### Option 1: Wait it Out
```
⏰ Wait 5-10 minutes, then try again
📊 Free quotas reset every hour
```

#### Option 2: New API Key
```
🔗 Go to: https://makersuite.google.com/app/apikey
➕ Click "Create API Key"
🔑 Use the new key in HireMe Maker
```

#### Option 3: Check Usage
```
🔗 Go to: https://makersuite.google.com/app/usage
📈 See your current usage
⏳ Wait for reset if at limit
```

### 💳 **Enable Billing (For Heavy Usage):**
1. Go to Google Cloud Console
2. Enable billing for your project
3. Set budget alerts
4. Much higher limits available

### 🧪 **Test Your API Key:**
Run this in your project folder:
```bash
python test_api_key.py
```

### ✅ **Prevention Tips:**
- **Use shorter prompts** - Saves tokens
- **Test with simple text first** - Before uploading large resumes  
- **Space out requests** - Don't spam the API
- **Create multiple API keys** - For backup

### 🔄 **Current HireMe Maker Settings:**
- ✅ Uses only `gemini-1.5-flash` (fastest, most efficient)
- ✅ Optimized prompts to save tokens
- ✅ Better error handling for quota issues

**Your quota should reset soon! Try again in 5-10 minutes.** 🕐 