/**
 * Intelligent Motivational Response System
 * Comprehensive responses for each detected emotion with context awareness
 */

import { Language } from './culturalAdaptation';

export type DetectedEmotion = 'happy' | 'sad' | 'angry' | 'surprised' | 'neutral' | 'fearful' | 'disgusted';

export interface EmotionResponse {
  message: string;
  speechRate: number; // 0.7 to 1.2
  suggestedAction?: 'relax' | 'learn' | 'chat' | 'breathe';
  wellnessPoints: number;
}

// Time-based context
function getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 21) return 'evening';
  return 'night';
}

// Sad/Distressed Responses
const sadResponses = {
  en: [
    "Hey, I can see you're going through something tough right now. Remember, every storm passes, and you're stronger than you think! 💙",
    "It's okay to feel sad sometimes. You're human, and that's beautiful. Would you like to try some deep breathing with me?",
    "I'm here with you. Your feelings are valid, and tomorrow is a fresh start full of possibilities. 🌅",
    "You're not alone in this feeling. Even the darkest nights end with a sunrise. Let me support you through this. 🌙",
    "I see the weight you're carrying. You're incredibly brave for facing today. Let's take it one moment at a time. 💪",
    "Your sadness shows how deeply you care. That's a beautiful quality. Would you like to talk about it or try a calming exercise?",
  ],
  hi: [
    "मैं देख सकता हूं कि आप कुछ मुश्किल से गुजर रहे हैं। याद रखें, हर तूफान गुजर जाता है! 💙",
    "कभी-कभी उदास महसूस करना ठीक है। आप इंसान हैं, और यह खूबसूरत है। 🌅",
    "मैं आपके साथ हूं। आपकी भावनाएं मान्य हैं। कल एक नई शुरुआत है। 💪",
  ],
  hinglish: [
    "Main dekh sakta hoon aap kuch mushkil se guzar rahe hain. Yaad rakhein, har toofan guzar jaata hai! 💙",
    "Kabhi-kabhi udaas feel karna theek hai. Aap insaan hain, aur yeh khoobsurat hai. 🌅",
    "Main aapke saath hoon. Kal ek nayi shuruaat hai full of possibilities! 💪",
  ],
};

// Happy/Joyful Responses
const happyResponses = {
  en: [
    "That beautiful smile is contagious! I love seeing you this happy. Let's make today even more amazing! ✨",
    "Your positive energy is incredible! Ready to learn something awesome or spread more joy?",
    "You're glowing today! This happiness looks perfect on you. Let's channel this energy into something great! 🌟",
    "That smile just made my day! Your joy is inspiring. What amazing things shall we accomplish together today?",
    "I can feel your happiness from here! This is the perfect energy for learning and growing. Let's go! 🚀",
    "Your radiant smile tells me today is going to be wonderful! Ready to make it even better?",
  ],
  hi: [
    "यह खूबसूरत मुस्कान संक्रामक है! आज को और भी शानदार बनाते हैं! ✨",
    "आपकी सकारात्मक ऊर्जा अविश्वसनीय है! कुछ नया सीखने के लिए तैयार हैं?",
    "आप आज चमक रहे हैं! यह खुशी आप पर बिल्कुल सही लग रही है! 🌟",
  ],
  hinglish: [
    "Yeh beautiful smile contagious hai! Aaj ko aur bhi amazing banate hain! ✨",
    "Aapki positive energy incredible hai! Kuch naya seekhne ke liye ready?",
    "Aap aaj glow kar rahe ho! Yeh happiness aap par perfect lag rahi hai! 🌟",
  ],
};

// Angry/Frustrated Responses
const angryResponses = {
  en: [
    "I can see you're feeling frustrated. Let's turn that fire into fuel for success! You've got this! 🔥",
    "Anger shows you care deeply. Let's take a moment to breathe and transform this energy into something powerful.",
    "You're stronger than whatever is making you angry. Want to try a quick calming exercise together?",
    "I feel your frustration. That intensity can be channeled into amazing achievements. Let's redirect this energy! 💪",
    "You have every right to feel angry. Now let's use that passion to overcome what's bothering you. Ready?",
    "Frustration means you're pushing boundaries. That's growth! Let's breathe and tackle this together. 🌬️",
  ],
  hi: [
    "मैं देख सकता हूं कि आप निराश महसूस कर रहे हैं। इस आग को सफलता के लिए ईंधन में बदलें! 🔥",
    "गुस्सा दिखाता है कि आप गहराई से परवाह करते हैं। चलिए सांस लें और इस ऊर्जा को शक्तिशाली में बदलें।",
    "आप जो भी आपको गुस्सा दिला रहा है उससे मजबूत हैं। शांत व्यायाम करें? 💪",
  ],
  hinglish: [
    "Main dekh sakta hoon aap frustrated feel kar rahe hain. Is fire ko fuel mein badlein! 🔥",
    "Gussa dikhata hai aap deeply care karte hain. Chaliye breathe karein aur energy transform karein.",
    "Aap jo bhi aapko angry bana raha hai usse strong hain. Calming exercise try karein? 💪",
  ],
};

// Surprised Responses
const surprisedResponses = {
  en: [
    "Whoa! I love that surprised look! Ready for more amazing discoveries today? 🎉",
    "Something caught your attention! That curiosity is going to take you far. Let's explore together!",
    "That expression of wonder is beautiful! Your mind is ready to learn. What shall we discover?",
    "Surprise is the beginning of discovery! I love seeing that spark in your eyes. Let's keep it going! ✨",
    "Your curiosity is showing! This is the perfect mindset for learning new things. Ready to dive in?",
  ],
  hi: [
    "वाह! मुझे वह आश्चर्यचकित नज़र पसंद है! आज और अद्भुत खोजों के लिए तैयार? 🎉",
    "कुछ ने आपका ध्यान खींचा! यह जिज्ञासा आपको दूर ले जाएगी। साथ में खोजें!",
    "आश्चर्य की यह अभिव्यक्ति सुंदर है! आपका दिमाग सीखने के लिए तैयार है! ✨",
  ],
  hinglish: [
    "Whoa! Mujhe woh surprised look pasand hai! Aaj aur amazing discoveries ke liye ready? 🎉",
    "Kuch ne aapka dhyaan khincha! Yeh curiosity aapko door le jayegi. Saath mein explore karein!",
    "Surprise ki yeh expression beautiful hai! Aapka mind seekhne ke liye ready hai! ✨",
  ],
};

// Neutral/Tired Responses
const neutralResponses = {
  en: [
    "I can sense you're feeling neutral today. That's perfectly fine - even small steps forward count! 🚶‍♂️",
    "Starting slow is still starting! What would make your day a little brighter right now?",
    "Every day doesn't have to be perfect. You're here, and that's what matters. Let's take it easy today. ☘️",
    "Feeling neutral is okay. Not every moment needs to be extraordinary. How can I support you today?",
    "I see you're in a calm state. That's a good foundation. What small thing can we accomplish together?",
    "Neutral is peaceful. Sometimes that's exactly what we need. Ready for a gentle start?",
  ],
  hi: [
    "मैं महसूस कर सकता हूं कि आप आज तटस्थ महसूस कर रहे हैं। यह बिल्कुल ठीक है! 🚶‍♂️",
    "धीरे शुरू करना भी शुरू करना है! आज आपके दिन को थोड़ा उज्जवल क्या बना सकता है?",
    "हर दिन परफेक्ट होना जरूरी नहीं। आप यहां हैं, और यही मायने रखता है। ☘️",
  ],
  hinglish: [
    "Main feel kar sakta hoon aap aaj neutral feel kar rahe hain. Yeh perfectly fine hai! 🚶‍♂️",
    "Slow start bhi start hai! Aaj aapke din ko thoda brighter kya bana sakta hai?",
    "Har din perfect hona zaroori nahi. Aap yahan hain, aur yahi matters. ☘️",
  ],
};

// Fearful/Anxious Responses
const fearfulResponses = {
  en: [
    "I see some worry in your eyes. You're braver than you believe and stronger than you feel. I'm here to support you! 🛡️",
    "Anxiety is just excitement without breath. Let's breathe together and turn this nervousness into power!",
    "You've overcome challenges before, and you'll overcome this too. One breath at a time. 🌬️",
    "I can sense your anxiety. Remember, courage isn't the absence of fear - it's moving forward despite it. You've got this! 💪",
    "Those worried eyes tell me you care deeply. Let's transform that anxiety into focused energy together.",
    "Fear is temporary, but your strength is permanent. Let's face this together with some calming breaths. 🧘",
  ],
  hi: [
    "मैं आपकी आंखों में कुछ चिंता देखता हूं। आप जितना मानते हैं उससे बहादुर हैं! 🛡️",
    "चिंता बस सांस के बिना उत्साह है। साथ में सांस लें और इस घबराहट को शक्ति में बदलें!",
    "आपने पहले चुनौतियों को पार किया है, और आप इसे भी पार करेंगे। एक सांस एक समय में। 🌬️",
  ],
  hinglish: [
    "Main aapki aankhon mein kuch worry dekhta hoon. Aap jitna believe karte hain usse brave hain! 🛡️",
    "Anxiety bas excitement hai without breath. Saath mein breathe karein aur nervousness ko power mein badlein!",
    "Aapne pehle challenges overcome kiye hain, aur aap isse bhi karenge. Ek breath ek time mein. 🌬️",
  ],
};

// Disgusted Responses
const disgustedResponses = {
  en: [
    "I can see something's bothering you. Let's shift focus to something positive and uplifting! 🌈",
    "That reaction shows you have strong values. Let's channel that into something constructive together.",
    "I sense discomfort. How about we move to something that brings you joy instead?",
  ],
  hi: [
    "मैं देख सकता हूं कि कुछ आपको परेशान कर रहा है। चलिए कुछ सकारात्मक पर ध्यान दें! 🌈",
    "यह प्रतिक्रिया दिखाती है कि आपके पास मजबूत मूल्य हैं। इसे रचनात्मक में बदलें।",
  ],
  hinglish: [
    "Main dekh sakta hoon kuch aapko bother kar raha hai. Chaliye kuch positive par focus karein! 🌈",
    "Yeh reaction dikhata hai aapke paas strong values hain. Isse constructive mein channel karein.",
  ],
};

// Time-based variations
const timeBasedPrefixes = {
  morning: {
    en: "Good morning! ",
    hi: "सुप्रभात! ",
    hinglish: "Good morning! ",
  },
  afternoon: {
    en: "Good afternoon! ",
    hi: "नमस्ते! ",
    hinglish: "Good afternoon! ",
  },
  evening: {
    en: "Good evening! ",
    hi: "शुभ संध्या! ",
    hinglish: "Good evening! ",
  },
  night: {
    en: "Hey there! ",
    hi: "नमस्ते! ",
    hinglish: "Hey! ",
  },
};

export function getEmotionResponse(
  emotion: DetectedEmotion,
  language: Language = 'en',
  userName?: string,
  includeTimeGreeting: boolean = false
): EmotionResponse {
  let responses: string[];
  let suggestedAction: 'relax' | 'learn' | 'chat' | 'breathe' | undefined;
  let speechRate = 0.9;
  let wellnessPoints = 5;

  // Select responses based on emotion
  switch (emotion) {
    case 'sad':
      responses = sadResponses[language];
      suggestedAction = 'breathe';
      speechRate = 0.8;
      wellnessPoints = 3;
      break;
    case 'happy':
      responses = happyResponses[language];
      suggestedAction = 'learn';
      speechRate = 1.0;
      wellnessPoints = 10;
      break;
    case 'angry':
      responses = angryResponses[language];
      suggestedAction = 'relax';
      speechRate = 0.85;
      wellnessPoints = 5;
      break;
    case 'surprised':
      responses = surprisedResponses[language];
      suggestedAction = 'learn';
      speechRate = 1.1;
      wellnessPoints = 8;
      break;
    case 'neutral':
      responses = neutralResponses[language];
      suggestedAction = undefined;
      speechRate = 0.9;
      wellnessPoints = 5;
      break;
    case 'fearful':
      responses = fearfulResponses[language];
      suggestedAction = 'breathe';
      speechRate = 0.8;
      wellnessPoints = 5;
      break;
    case 'disgusted':
      responses = disgustedResponses[language];
      suggestedAction = 'relax';
      speechRate = 0.9;
      wellnessPoints = 3;
      break;
    default:
      responses = neutralResponses[language];
      suggestedAction = undefined;
      speechRate = 0.9;
      wellnessPoints = 5;
  }

  // Select random response
  let message = responses[Math.floor(Math.random() * responses.length)];

  // Add time-based greeting if requested
  if (includeTimeGreeting) {
    const timeOfDay = getTimeOfDay();
    const prefix = timeBasedPrefixes[timeOfDay][language];
    message = prefix + message;
  }

  // Personalize with user name if available
  if (userName && Math.random() > 0.5) {
    message = message.replace(/You're/g, `${userName}, you're`);
    message = message.replace(/You've/g, `${userName}, you've`);
    message = message.replace(/Your/g, `${userName}, your`);
  }

  return {
    message,
    speechRate,
    suggestedAction,
    wellnessPoints,
  };
}

// Map face-api.js emotions to our emotion types
export function mapFaceApiEmotion(expressions: any): DetectedEmotion {
  const emotions = {
    happy: expressions.happy || 0,
    sad: expressions.sad || 0,
    angry: expressions.angry || 0,
    surprised: expressions.surprised || 0,
    neutral: expressions.neutral || 0,
    fearful: expressions.fearful || 0,
    disgusted: expressions.disgusted || 0,
  };

  // Find dominant emotion
  const dominant = Object.entries(emotions).reduce((a, b) => (a[1] > b[1] ? a : b));
  return dominant[0] as DetectedEmotion;
}

// Get emotion color for UI
export function getEmotionColor(emotion: DetectedEmotion): { from: string; to: string } {
  switch (emotion) {
    case 'happy':
      return { from: '#FFD700', to: '#FFA500' };
    case 'sad':
      return { from: '#87CEEB', to: '#4682B4' };
    case 'angry':
      return { from: '#FF6347', to: '#DC143C' };
    case 'surprised':
      return { from: '#FFE4B5', to: '#FFA07A' };
    case 'neutral':
      return { from: '#98D8C8', to: '#6BCF7F' };
    case 'fearful':
      return { from: '#DDA0DD', to: '#9370DB' };
    case 'disgusted':
      return { from: '#D8BFD8', to: '#9370DB' };
    default:
      return { from: '#98D8C8', to: '#6BCF7F' };
  }
}
