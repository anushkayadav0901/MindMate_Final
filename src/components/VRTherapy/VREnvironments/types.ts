import { ComponentType } from 'react';
import { EnvironmentPreset } from '@react-three/drei';

export interface VREnvironmentProps {
  quality?: 'low' | 'medium' | 'high';
}

export interface VREnvironment {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: ComponentType<VREnvironmentProps>;
  lighting: EnvironmentPreset;
  defaultPosition?: [number, number, number];
  audioTrack?: string;
}