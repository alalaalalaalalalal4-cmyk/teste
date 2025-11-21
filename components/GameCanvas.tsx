import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Sky, Stars, PointerLockControls, AmbientLight } from '@react-three/drei';
import Player from './Player';
import Level from './Level';
import { GameState, LevelData } from '../types';

interface GameCanvasProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  levelData: LevelData;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, setGameState, levelData }) => {
  const isPlaying = gameState === GameState.PLAYING;

  return (
    <Canvas shadows camera={{ fov: 75 }}>
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />
      
      <Suspense fallback={null}>
        <Physics gravity={[0, -15, 0]}>
          <Player 
            startPos={levelData.startPos} 
            gameState={gameState}
            setGameState={setGameState}
          />
          <Level 
            data={levelData} 
            onFinish={() => setGameState(GameState.FINISHED)}
          />
        </Physics>
      </Suspense>

      {isPlaying && <PointerLockControls />}
    </Canvas>
  );
};

export default GameCanvas;