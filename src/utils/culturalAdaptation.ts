/**
 * Cultural & Linguistic Adaptation System
 * Supports English, Hindi, and Hinglish with cultural context
 */

export type Language = 'en' | 'hi' | 'hinglish';

export interface CulturalPhrase {
  en: string;
  hi: string;
  hinglish: string;
}

// Greetings
export const greetings: Record<string, CulturalPhrase> = {
  morning: {
    en: 'Good morning',
    hi: 'सुप्रभात',
    hinglish: 'Good morning',
  },
  afternoon: {
    en: 'Good afternoon',
    hi: 'नमस्ते',
    hinglish: 'Good afternoon',
  },
  evening: {
    en: 'Good evening',
    hi: 'शुभ संध्या',
    hinglish: 'Good evening',
  },
  night: {
    en: 'Good night',
    hi: 'शुभ रात्रि',
    hinglish: 'Good night',
  },
};

// Motivational phrases
export const motivationalPhrases: CulturalPhrase[] = [
  {
    en: "You're doing amazing! Keep it up!",
    hi: 'आप बहुत अच्छा कर रहे हैं! ऐसे ही जारी रखें!',
    hinglish: 'Aap bahut accha kar rahe ho! Keep it up!',
  },
  {
    en: "Every step forward is progress!",
    hi: 'आगे बढ़ने का हर कदम प्रगति है!',
    hinglish: 'Aage badhne ka har kadam progress hai!',
  },
  {
    en: "I believe in you!",
    hi: 'मुझे आप पर विश्वास है!',
    hinglish: 'Mujhe aap par vishwas hai!',
  },
  {
    en: "You've got this!",
    hi: 'आप यह कर सकते हैं!',
    hinglish: 'Aap yeh kar sakte ho!',
  },
  {
    en: "Small steps lead to big achievements!",
    hi: 'छोटे कदम बड़ी उपलब्धियों की ओर ले जाते हैं!',
    hinglish: 'Chhote kadam badi achievements ki taraf le jaate hain!',
  },
];

// Encouragement during study
export const studyEncouragement: CulturalPhrase[] = [
  {
    en: "Let's break this down together!",
    hi: 'चलिए इसे साथ मिलकर समझते हैं!',
    hinglish: 'Chaliye ise saath milkar samajhte hain!',
  },
  {
    en: "Take your time, no rush!",
    hi: 'अपना समय लें, कोई जल्दी नहीं!',
    hinglish: 'Apna time lo, koi jaldi nahi!',
  },
  {
    en: "You're making great progress!",
    hi: 'आप बहुत अच्छी प्रगति कर रहे हैं!',
    hinglish: 'Aap bahut acchi progress kar rahe ho!',
  },
  {
    en: "It's okay to take breaks!",
    hi: 'ब्रेक लेना ठीक है!',
    hinglish: 'Break lena theek hai!',
  },
];

// Stress relief phrases
export const stressReliefPhrases: CulturalPhrase[] = [
  {
    en: "Let's take a deep breath together",
    hi: 'चलिए साथ में गहरी सांस लेते हैं',
    hinglish: 'Chaliye saath mein deep breath lete hain',
  },
  {
    en: "You're not alone in this",
    hi: 'इसमें आप अकेले नहीं हैं',
    hinglish: 'Isme aap akele nahi hain',
  },
  {
    en: "Everything will be okay",
    hi: 'सब कुछ ठीक हो जाएगा',
    hinglish: 'Sab kuch theek ho jayega',
  },
  {
    en: "I'm here to support you",
    hi: 'मैं आपका साथ देने के लिए यहाँ हूँ',
    hinglish: 'Main aapka saath dene ke liye yahan hoon',
  },
];

// Achievement celebrations
export const achievementCelebrations: CulturalPhrase[] = [
  {
    en: 'Congratulations! Well done!',
    hi: 'बधाई हो! बहुत बढ़िया!',
    hinglish: 'Badhai ho! Bahut badhiya!',
  },
  {
    en: "You're a star!",
    hi: 'आप एक सितारे हैं!',
    hinglish: 'Aap ek sitaare hain!',
  },
  {
    en: 'Fantastic achievement!',
    hi: 'शानदार उपलब्धि!',
    hinglish: 'Shandar achievement!',
  },
  {
    en: "I'm so proud of you!",
    hi: 'मुझे आप पर बहुत गर्व है!',
    hinglish: 'Mujhe aap par bahut garv hai!',
  },
];

// Indian cultural references
export const culturalReferences: CulturalPhrase[] = [
  {
    en: 'Like a lotus rising from mud, you rise above challenges',
    hi: 'कीचड़ से उगने वाले कमल की तरह, आप चुनौतियों से ऊपर उठते हैं',
    hinglish: 'Kamal ki tarah, aap challenges se upar uthte ho',
  },
  {
    en: 'Your dedication shines like the morning sun',
    hi: 'आपका समर्पण सुबह के सूरज की तरह चमकता है',
    hinglish: 'Aapka dedication subah ke suraj ki tarah chamakta hai',
  },
  {
    en: 'Knowledge is the light that dispels darkness',
    hi: 'ज्ञान वह प्रकाश है जो अंधकार को दूर करता है',
    hinglish: 'Gyan woh light hai jo darkness ko door karta hai',
  },
];

// Festival greetings
export const festivalGreetings: Record<string, CulturalPhrase> = {
  diwali: {
    en: 'Happy Diwali! May your learning journey be as bright as diyas!',
    hi: 'दीपावली की शुभकामनाएं! आपकी सीखने की यात्रा दीयों की तरह उज्ज्वल हो!',
    hinglish: 'Happy Diwali! Aapki learning journey diyon ki tarah bright ho!',
  },
  holi: {
    en: 'Happy Holi! May your studies be as colorful as this festival!',
    hi: 'होली की शुभकामनाएं! आपकी पढ़ाई इस त्योहार की तरह रंगीन हो!',
    hinglish: 'Happy Holi! Aapki studies is festival ki tarah colorful ho!',
  },
  newYear: {
    en: 'Happy New Year! New year, new goals, new achievements!',
    hi: 'नव वर्ष की शुभकामनाएं! नया साल, नए लक्ष्य, नई उपलब्धियां!',
    hinglish: 'Happy New Year! Naya saal, naye goals, nayi achievements!',
  },
};

// Gesture descriptions (for animation context)
export const gestures = {
  namaste: {
    description: 'Hands pressed together in front of chest',
    context: 'greeting, respect, gratitude',
  },
  thumbsUp: {
    description: 'Thumb pointing upward',
    context: 'approval, encouragement, good job',
  },
  headNod: {
    description: 'Gentle head nod',
    context: 'agreement, understanding, listening',
  },
  headShake: {
    description: 'Side-to-side head shake',
    context: 'disagreement, concern, no',
  },
  indianHeadBobble: {
    description: 'Figure-8 head movement',
    context: 'acknowledgment, maybe, understanding',
  },
};

// Get phrase in user's preferred language
export function getPhrase(phrase: CulturalPhrase, language: Language): string {
  return phrase[language];
}

// Get random motivational phrase
export function getRandomMotivation(language: Language): string {
  const phrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
  return getPhrase(phrase, language);
}

// Get random study encouragement
export function getRandomStudyEncouragement(language: Language): string {
  const phrase = studyEncouragement[Math.floor(Math.random() * studyEncouragement.length)];
  return getPhrase(phrase, language);
}

// Get random stress relief phrase
export function getRandomStressRelief(language: Language): string {
  const phrase = stressReliefPhrases[Math.floor(Math.random() * stressReliefPhrases.length)];
  return getPhrase(phrase, language);
}

// Get random achievement celebration
export function getRandomAchievementCelebration(language: Language): string {
  const phrase = achievementCelebrations[Math.floor(Math.random() * achievementCelebrations.length)];
  return getPhrase(phrase, language);
}

// Get greeting based on time of day
export function getTimeBasedGreeting(language: Language): string {
  const hour = new Date().getHours();
  let timeOfDay: keyof typeof greetings;

  if (hour < 12) timeOfDay = 'morning';
  else if (hour < 17) timeOfDay = 'afternoon';
  else if (hour < 21) timeOfDay = 'evening';
  else timeOfDay = 'night';

  return getPhrase(greetings[timeOfDay], language);
}

// Check if it's a festival day (simplified - can be enhanced with actual calendar)
export function getFestivalGreeting(language: Language): string | null {
  const today = new Date();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  // Diwali (approximate - varies by lunar calendar)
  if (month === 10 || month === 11) {
    return getPhrase(festivalGreetings.diwali, language);
  }

  // Holi (approximate - March)
  if (month === 3 && day >= 15 && day <= 25) {
    return getPhrase(festivalGreetings.holi, language);
  }

  // New Year
  if (month === 1 && day <= 7) {
    return getPhrase(festivalGreetings.newYear, language);
  }

  return null;
}

// Get culturally appropriate response based on context
export function getCulturalResponse(context: string, language: Language): string {
  const lowerContext = context.toLowerCase();

  if (lowerContext.includes('stress') || lowerContext.includes('anxious')) {
    return getRandomStressRelief(language);
  }

  if (lowerContext.includes('achievement') || lowerContext.includes('completed')) {
    return getRandomAchievementCelebration(language);
  }

  if (lowerContext.includes('study') || lowerContext.includes('learn')) {
    return getRandomStudyEncouragement(language);
  }

  return getRandomMotivation(language);
}

// Indian proverbs and wisdom
export const indianWisdom: CulturalPhrase[] = [
  {
    en: 'The mind is everything. What you think, you become.',
    hi: 'मन ही सब कुछ है। आप जो सोचते हैं, वही बन जाते हैं।',
    hinglish: 'Mind hi sab kuch hai. Aap jo sochte ho, wahi ban jaate ho.',
  },
  {
    en: 'Learning is a treasure that follows its owner everywhere.',
    hi: 'सीखना एक खजाना है जो अपने मालिक के साथ हर जगह जाता है।',
    hinglish: 'Seekhna ek khazana hai jo apne malik ke saath har jagah jaata hai.',
  },
  {
    en: 'The best time to plant a tree was 20 years ago. The second best time is now.',
    hi: 'पेड़ लगाने का सबसे अच्छा समय 20 साल पहले था। दूसरा सबसे अच्छा समय अभी है।',
    hinglish: 'Ped lagane ka best time 20 saal pehle tha. Dusra best time abhi hai.',
  },
];

export function getRandomWisdom(language: Language): string {
  const wisdom = indianWisdom[Math.floor(Math.random() * indianWisdom.length)];
  return getPhrase(wisdom, language);
}
