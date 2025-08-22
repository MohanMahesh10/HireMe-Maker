import google.generativeai as genai

def test_api_key(api_key):
    """Test if API key works with gemini-1.5-flash"""
    try:
        genai.configure(api_key=api_key)
        
        # Test only gemini-1.5-flash
        model_name = 'gemini-1.5-flash'
        try:
            print(f"Testing {model_name}...")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hi")
            print(f"✅ {model_name}: SUCCESS - {response.text.strip()}")
            return model_name
        except Exception as e:
            error_msg = str(e)
            print(f"❌ {model_name}: FAILED - {error_msg}")
            
            if "quota" in error_msg.lower() or "resource_exhausted" in error_msg.lower():
                print("💡 QUOTA ISSUE: Wait a few minutes and try again, or check billing in Google AI Studio")
            elif "invalid" in error_msg.lower():
                print("💡 API KEY ISSUE: Check if your API key is correct")
            
            return None
        
    except Exception as e:
        print(f"❌ API Key Error: {str(e)}")
        return None

if __name__ == "__main__":
    print("🔑 Gemini API Key Tester (gemini-1.5-flash)")
    print("=" * 50)
    
    api_key = input("Enter your Gemini API key: ").strip()
    
    if not api_key:
        print("❌ No API key provided")
    elif not api_key.startswith('AIza'):
        print("❌ Invalid API key format (should start with 'AIza')")
    else:
        working_model = test_api_key(api_key)
        if working_model:
            print(f"\n🎉 SUCCESS! Your API key works with {working_model}")
            print("You can now use HireMe Maker!")
        else:
            print("\n❌ FAILED! Please check:")
            print("1. API key is correct")
            print("2. Internet connection")
            print("3. Gemini API quotas (wait 5-10 minutes)")
            print("4. Try creating a new API key")
            print("5. Check billing in Google AI Studio") 