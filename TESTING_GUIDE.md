# 🧪 Testing Guide - Advanced Avatar Features

## 🚀 How to See the Features on Your Website

### Step 1: Start Your Development Server

```bash
# Navigate to your MindMate directory
cd d:\MindMate

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

The app should open at `http://localhost:5173` (or similar port shown in terminal)

---

## ✅ What You'll See Immediately

### **1. Enhanced Home Page**
When you load the website, you'll see:
- ✨ **Advanced 3D Avatar** with smooth animations
- 🎤 **Voice input button** (microphone icon)
- 💬 **Text input field** to type messages
- ⚙️ **Settings button** (top right) - Opens customization
- 📊 **Progress button** (top right) - Opens dashboard

### **2. Avatar Expressions**
The avatar will automatically show different expressions:
- **Happy** - When greeting you
- **Listening** - When you click the microphone
- **Thinking** - When processing your input
- **Empathetic** - When you mention stress
- **Motivated** - When you want to learn

---

## 🧪 Test Each Feature

### **Test 1: Personalized Greeting**
1. Open the website
2. Avatar should greet you with a personalized message
3. Listen to the avatar speak (TTS)
4. **Expected**: "Good morning/afternoon/evening! I'm MindMate..."

### **Test 2: Avatar Customization**
1. Click the **Settings icon** (⚙️) in top-right
2. Enter your name (e.g., "Anushka")
3. Select learning style (e.g., "Visual")
4. Choose personality (e.g., "Encouraging")
5. Select language (e.g., "Hinglish")
6. Click "Save Changes"
7. **Expected**: Avatar says "Great! I'll remember that you prefer visual learning style..."

### **Test 3: Voice Interaction**
1. Click the **microphone button** 🎤
2. Say: "I want to learn"
3. **Expected**: 
   - Avatar shows "listening" expression (tilted head)
   - Then shows "motivated" expression
   - Navigates to Learn page

### **Test 4: Text Interaction**
1. Type in the text box: "I'm feeling stressed"
2. Press Enter or click send
3. **Expected**:
   - Avatar shows "empathetic" expression
   - Says: "Let's take a deep breath together" (or similar)
   - Navigates to Relax page

### **Test 5: Progress Dashboard**
1. Click the **TrendingUp icon** (📊) in top-right
2. **Expected**: Modal opens showing:
   - Study sessions count
   - Total study time
   - Chapters completed
   - Breathing exercises
   - Weekly goal progress bar

### **Test 6: Achievement System**
1. Navigate to Learn page
2. Upload a PDF textbook
3. Wait for processing
4. **Expected**: 
   - Achievement notification pops up: "First Steps! 🎉"
   - Celebration particles around notification
   - Auto-dismisses after 5 seconds

### **Test 7: Multi-Language Support**
1. Open Settings (⚙️)
2. Change language to "हिंदी" (Hindi)
3. Save changes
4. **Expected**: Avatar speaks in Hindi
5. Try "Hinglish" for mixed language

### **Test 8: Micro-Expressions**
Watch the avatar change expressions based on context:
- Type "I'm confused" → **Confused expression** (tilted head, furrowed brow)
- Type "I'm excited!" → **Excited expression** (big smile, wide eyes)
- Type "I'm tired" → **Tired expression** (half-closed eyes)
- Type "Great job!" → **Proud expression** (warm smile, sparkles)

### **Test 9: Break Suggestion**
1. Stay on Learn page for 45+ minutes (simulated)
2. **Expected**: Avatar proactively suggests:
   - "I notice you've been studying for 45 minutes. How about a breathing break?"
   - Shows "empathetic" expression

### **Test 10: Conversation Memory**
1. Type: "I'm stressed about math"
2. Navigate away and come back
3. Type: "math" again
4. **Expected**: Avatar says:
   - "I remember you felt stressed about math before. Let's take it slow this time. 💙"

---

## 🎨 Visual Features to Look For

### **Avatar Animations:**
- ✅ **Eye blinking** - Every 3-5 seconds
- ✅ **Head tilting** - When listening or confused
- ✅ **Mouth shapes** - Smile, frown, open, surprised
- ✅ **Eyebrow movements** - Raised when curious, furrowed when concerned
- ✅ **Sparkles** - Appear when happy/celebrating
- ✅ **Glow effects** - Intensity changes with mood
- ✅ **Smooth transitions** - 800ms ease-in-out between expressions

### **UI Elements:**
- ✅ **Glassmorphism** - Frosted glass effect on modals
- ✅ **Gradient backgrounds** - Animated color shifts
- ✅ **Achievement cards** - Yellow-orange gradient with bounce animation
- ✅ **Progress bars** - Teal-to-green gradient
- ✅ **Notification popups** - Top-right corner with particles

---

## 🐛 Troubleshooting

### **Avatar not showing?**
- Check browser console (F12) for errors
- Ensure all files are saved
- Restart dev server: `Ctrl+C` then `npm run dev`

### **Voice input not working?**
- Allow microphone permissions in browser
- Chrome/Edge work best for Web Speech API
- Check if microphone icon shows red when clicked

### **Achievements not appearing?**
- Open browser DevTools (F12)
- Go to Application → Local Storage
- Check `mindmate_user_progress` key
- Should show JSON with achievements array

### **Language not changing?**
- Clear localStorage: `localStorage.clear()` in console
- Refresh page
- Set language again in Settings

### **Expressions not changing?**
- Check console for errors in `microExpressions.ts`
- Verify `AdvancedAvatar3D` is imported correctly
- Try different context phrases

---

## 📱 Browser Compatibility

**Best Experience:**
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ⚠️ Safari (limited Web Speech API)

**Features Requiring Permissions:**
- 🎤 Microphone (for voice input)
- 🔊 Audio (for TTS)

---

## 🎯 Quick Test Checklist

- [ ] Avatar loads with personalized greeting
- [ ] Settings modal opens and saves preferences
- [ ] Progress dashboard shows stats
- [ ] Voice input recognizes speech
- [ ] Text input triggers appropriate responses
- [ ] Avatar expressions change smoothly
- [ ] Achievement notification appears
- [ ] Language switching works
- [ ] Break suggestion appears (after time)
- [ ] Conversation memory works

---

## 📊 Check localStorage Data

Open browser console (F12) and run:

```javascript
// View user profile
console.log(JSON.parse(localStorage.getItem('mindmate_user_profile')));

// View progress
console.log(JSON.parse(localStorage.getItem('mindmate_user_progress')));

// View conversation memory
console.log(JSON.parse(localStorage.getItem('mindmate_conversation_memory')));

// View interaction patterns
console.log(JSON.parse(localStorage.getItem('mindmate_interaction_pattern')));
```

---

## 🎉 Success Indicators

You'll know it's working when:
1. ✅ Avatar greets you by name (after setting it)
2. ✅ Expressions change based on your input
3. ✅ Achievement popup appears after first action
4. ✅ Progress dashboard shows your stats
5. ✅ Avatar speaks in your chosen language
6. ✅ Smooth animations and transitions
7. ✅ Voice input recognized and processed
8. ✅ Break suggestions appear proactively

---

## 🚀 Next: Share Screenshots!

Once you see the features working:
1. Take screenshots of the avatar expressions
2. Record a video of voice interaction
3. Show the achievement notification
4. Capture the progress dashboard

**Your advanced emotional AI companion is ready!** 🎊
