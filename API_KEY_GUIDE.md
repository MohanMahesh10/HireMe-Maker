# 🔑 How to Get Your Gemini API Key

## Quick Steps:

1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey

2. **Sign in** with your Google account

3. **Click "Create API Key"**

4. **Copy the key** - it should start with `AIza...`

## ✅ Valid API Key Format:
```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## ❌ Common Issues:

### "Failed to validate API key"
- **Check format**: Must start with `AIza`
- **Remove spaces**: Copy the key carefully
- **New key**: Try creating a fresh API key

### "API quota exceeded"
- **Free tier**: Gemini has generous free limits
- **Wait**: Quotas reset daily
- **Billing**: Enable billing for higher limits

### "Model not available"
- **Region**: Some models aren't available in all regions
- **Try again**: Temporary API issues

## 🆓 Free Tier Limits:
- **15 requests per minute**
- **1 million tokens per day**
- **1,500 requests per day**

## 🧪 Test Your API Key:
You can test your API key manually:
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" \
  -H 'Content-Type: application/json' \
  -H 'X-goog-api-key: YOUR_API_KEY_HERE' \
  -X POST \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

## 🔒 Security:
- **Never share** your API key
- **Don't commit** to Git repositories
- **Regenerate** if compromised 