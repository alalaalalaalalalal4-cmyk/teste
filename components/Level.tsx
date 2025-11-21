import React from 'react';
import { useBox } from '@react-three/cannon';
import { LevelData, PlatformData } from '../types';
import { Text } from '@react-three/drei';

interface BoxProps extends PlatformData {}

const Platform: React.FC<BoxProps> = ({ position, size, color }) => {
  const [ref] = useBox(() => ({
    type: 'Static',
    position,
    args: size,
  }));

  return (
    <mesh ref={ref as any} receiveShadow castShadow>
      <boxGeometry args={size as any} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

const FinishZone: React.FC<{ position: [number, number, number], onReach: () => void }> = ({ position, onReach }) => {
    const [ref] = useBox(() => ({
        isTrigger: true,
        position,
        args: [6, 5, 6], // Large trigger zone
        onCollide: (e) => {
            if (e.body.name !== 'finish') { // Ensure it's the player
                 onReach();
            }
        }
    }));

    return (
        <group position={position}>
             <Text
                color="#fbbf24"
                fontSize={1}
                position={[0, 2, 0]}
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.05}
                outlineColor="#000"
            >
                FINISH
            </Text>
            <mesh ref={ref as any}>
                 <boxGeometry args={[6, 5, 6]} />
                 <meshBasicMaterial color="yellow" transparent opacity={0.1} wireframe />
            </mesh>
        </group>
    )
}

interface LevelProps {
  data: LevelData;
  onFinish: () => void;
}

const Level: React.FC<LevelProps> = ({ data, onFinish }) => {
  return (
    <group>
      {data.platforms.map((plat, index) => (
        <Platform key={index} {...plat} />
      ))}
      <FinishZone position={data.finishPos} onReach={onFinish} />
      
      {/* Ambient visual particles or decoration could go here */}
      <gridHelper args={[100, 100, 0x444444, 0x222222]} position={[0, -5, 0]} />
    </group>
  );
};

export default Level;