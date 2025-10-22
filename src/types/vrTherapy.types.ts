import { VREnvironment, VREnvironmentProps } from '../components/VRTherapy/VREnvironments/types';

export interface VRTherapyPageProps {
  onSessionComplete?: () => void;
  defaultEnvironmentId?: string;
  environmentQuality?: 'low' | 'medium' | 'high';
}

export interface VRTherapyState {
  selectedEnvironment: VREnvironment;
  sessionActive: boolean;
  paused: boolean;
  elapsedTime: number;
  volume: number;
  guidanceEnabled: boolean;
}

export type AudioGuidance = {
  text: string;
  timing: number;
};

export type TherapySession = {
  environmentId: string;
  startTime: Date;
  endTime: Date;
  totalDuration: number;
  elapsedTime: number;
  maxAnxietyLevel: number;
  minAnxietyLevel: number;
  avgAnxietyLevel: number;
};

export type { VREnvironment, VREnvironmentProps };