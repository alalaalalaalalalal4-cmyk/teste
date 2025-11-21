import { LevelData } from './types';

export const MOVEMENT_SPEED = 5;
export const SPRINT_MULTIPLIER = 1.8;
export const JUMP_FORCE = 5;

export const LEVELS: LevelData[] = [
  {
    id: 1,
    startPos: [0, 5, 0],
    finishPos: [0, 2, -45],
    platforms: [
      // Start Platform
      { position: [0, 0, 0], size: [4, 1, 4], color: '#3b82f6' }, // Blue
      // Bridge
      { position: [0, 0, -8], size: [2, 1, 6], color: '#f97316' }, // Orange
      // Jump
      { position: [0, 1, -16], size: [2, 1, 4], color: '#f97316' },
      // Side step
      { position: [-3, 2, -22], size: [3, 1, 3], color: '#ef4444' }, // Red
      { position: [0, 3, -28], size: [2, 1, 4], color: '#f97316' },
      // Long jump
      { position: [0, 2, -38], size: [3, 1, 6], color: '#22c55e' }, // Green (Goal area)
      // Goal platform
      { position: [0, 2, -45], size: [6, 1, 6], color: '#fbbf24' }, // Gold
    ]
  }
];