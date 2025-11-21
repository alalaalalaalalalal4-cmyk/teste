import React, { useEffect, useRef, useState } from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { MOVEMENT_SPEED, SPRINT_MULTIPLIER, JUMP_FORCE } from '../constants';
import { GameState } from '../types';

interface PlayerProps {
  startPos: [number, number, number];
  gameState: GameState;
  setGameState: (state: GameState) => void;
}

const Player: React.FC<PlayerProps> = ({ startPos, gameState, setGameState }) => {
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({
    mass: 1,
    type: 'Dynamic',
    position: startPos,
    fixedRotation: true, // Prevent sphere from rolling
    linearDamping: 0.1,
    args: [0.5], // Radius
  }));

  // Movement state
  const velocity = useRef([0, 0, 0]);
  const position = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (velocity.current = v)), [api.velocity]);
  useEffect(() => api.position.subscribe((p) => (position.current = p)), [api.position]);

  // Input state
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKeys((prev) => {
        const newSet = new Set(prev);
        newSet.add(e.code);
        return newSet;
      });
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys((prev) => {
        const newSet = new Set(prev);
        newSet.delete(e.code);
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame(() => {
    if (gameState !== GameState.PLAYING) return;

    const currentPos = new Vector3(...position.current);
    
    // Check for fall (Game Over)
    if (currentPos.y < -10) {
      setGameState(GameState.FAILED);
      api.position.set(...startPos);
      api.velocity.set(0, 0, 0);
      return;
    }

    // Camera follows player
    camera.position.copy(currentPos);
    // Slightly offset camera up for "eyes" position
    camera.position.y += 0.6; 

    // Movement Logic
    const frontVector = new Vector3(0, 0, 0);
    const sideVector = new Vector3(0, 0, 0);
    const direction = new Vector3(0, 0, 0);

    // WASD
    if (activeKeys.has('KeyW')) frontVector.z -= 1;
    if (activeKeys.has('KeyS')) frontVector.z += 1;
    if (activeKeys.has('KeyA')) sideVector.x -= 1;
    if (activeKeys.has('KeyD')) sideVector.x += 1;

    // Calculate global direction based on camera
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(
        (activeKeys.has('ShiftLeft') ? MOVEMENT_SPEED * SPRINT_MULTIPLIER : MOVEMENT_SPEED)
      )
      .applyEuler(camera.rotation);

    // Apply velocity (keep Y velocity for gravity)
    api.velocity.set(direction.x, velocity.current[1], direction.z);

    // Jump
    if (activeKeys.has('Space')) {
      // Simple ground check: raycasting is better, but checking strict Y velocity close to 0 works for basic physics
      if (Math.abs(velocity.current[1]) < 0.05) {
        api.velocity.set(velocity.current[0], JUMP_FORCE, velocity.current[2]);
      }
    }
  });

  return (
    <mesh ref={ref as any}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="hotpink" transparent opacity={0} /> 
    </mesh>
  );
};

export default Player;