import { VREnvironment } from '../components/VRTherapy/VREnvironments/types';
import { PeacefulGarden } from '../components/VRTherapy/VREnvironments/PeacefulGarden';
import { CollegeCampus } from '../components/VRTherapy/VREnvironments/CollegeCampus';
import { ExamHall } from '../components/VRTherapy/VREnvironments/ExamHall';
import { HomeRoom } from '../components/VRTherapy/VREnvironments/HomeRoom';

export const environments: VREnvironment[] = [
  {
    id: 'peaceful-garden',
    name: 'Peaceful Garden',
    description: 'A serene Japanese garden with calming water features and zen atmosphere',
    icon: '🌿',
    component: PeacefulGarden,
    lighting: 'sunset',
    defaultPosition: [0, 1.6, 4],
    audioTrack: 'garden-ambience.mp3'
  },
  {
    id: 'college-campus',
    name: 'College Campus',
    description: 'A quiet college campus setting with open spaces and academic buildings',
    icon: '🎓',
    component: CollegeCampus,
    lighting: 'dawn',
    defaultPosition: [0, 1.6, 5],
    audioTrack: 'campus-ambience.mp3'
  },
  {
    id: 'exam-hall',
    name: 'Exam Hall',
    description: 'A well-lit, organized examination hall for exposure therapy',
    icon: '📝',
    component: ExamHall,
    lighting: 'bright',
    defaultPosition: [0, 1.6, 3],
    audioTrack: 'exam-ambience.mp3'
  },
  {
    id: 'home-room',
    name: 'Home Room',
    description: 'A cozy home environment for practicing relaxation techniques',
    icon: '🏠',
    component: HomeRoom,
    lighting: 'apartment',
    defaultPosition: [0, 1.6, 3],
    audioTrack: 'home-ambience.mp3'
  }
];

export const getEnvironmentById = (id: string): VREnvironment => {
  const environment = environments.find(env => env.id === id);
  if (!environment) {
    throw new Error(`Environment with id "${id}" not found`);
  }
  return environment;
};

export const getAudioGuidance = (environmentId: string): { text: string, timing: number }[] => {
  const guidanceMap: Record<string, { text: string, timing: number }[]> = {
    'peaceful-garden': [
      { text: 'Welcome to your peaceful garden. Take a deep breath and look around.', timing: 0 },
      { text: 'Notice the gentle colors and shapes around you. Feel yourself becoming calmer.', timing: 30 },
      { text: 'Breathe in for 4 counts... hold... and breathe out for 4 counts.', timing: 60 },
      { text: 'You are safe here. This is your sanctuary. You can return here anytime.', timing: 120 }
    ],
    'college-campus': [
      { id: '1', text: 'You are standing in a college campus. This is a safe practice space.', timing: 0, type: 'instruction' },
      { id: '2', text: 'Imagine walking confidently through the corridors. You belong here.', timing: 45, type: 'encouragement' },
      { id: '3', text: 'Practice greeting someone. Say "Hello, how are you?" in your mind.', timing: 90, type: 'instruction' },
      { id: '4', text: 'Great job! With each practice, social situations become easier.', timing: 180, type: 'encouragement' }
    ],
    'exam-hall': [
      { id: '1', text: 'You are in an exam hall. Notice any anxiety rising - that is normal.', timing: 0, type: 'grounding' },
      { id: '2', text: 'Take slow breaths. You have prepared. You are capable.', timing: 40, type: 'breathing' },
      { id: '3', text: 'Anxiety is just energy. Channel it into focus and determination.', timing: 90, type: 'encouragement' },
      { id: '4', text: 'You have successfully faced your fear. Each exposure makes you stronger.', timing: 150, type: 'encouragement' }
    ],
    'home-room': [
      { id: '1', text: 'Welcome home. This is your safe space to relax and recharge.', timing: 0, type: 'instruction' },
      { id: '2', text: 'Feel the comfort surrounding you. You are protected here.', timing: 30, type: 'grounding' },
      { id: '3', text: 'Let all tension melt away. Your mind and body deserve rest.', timing: 80, type: 'encouragement' }
    ]
  };

  return guidanceMap[environmentId] || [];
};

export const checkVRSupport = async (): Promise<boolean> => {
  if ('xr' in navigator) {
    try {
      return await (navigator as any).xr.isSessionSupported('immersive-vr');
    } catch {
      return false;
    }
  }
  return false;
};

export const speakText = async (text: string): Promise<void> => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    return;
  }

  return new Promise((resolve, reject) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event);
      reject(new Error('Speech synthesis failed'));
    };

    // Wait for a short moment before speaking to ensure browser is ready
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        console.warn('Speech synthesis error:', error);
        reject(error);
      }
    }, 100);
  });
};

export const logTherapySession = (environmentId: string, duration: number) => {
  const sessions = JSON.parse(localStorage.getItem('vrTherapySessions') || '[]');
  sessions.push({
    environmentId,
    timestamp: new Date().toISOString(),
    duration,
    completed: true
  });
  localStorage.setItem('vrTherapySessions', JSON.stringify(sessions));
};