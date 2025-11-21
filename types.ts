export enum GameState {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED'
}

export interface LevelData {
  id: number;
  platforms: PlatformData[];
  startPos: [number, number, number];
  finishPos: [number, number, number];
}

export interface PlatformData {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  isMoving?: boolean;
}

export interface Controls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
}