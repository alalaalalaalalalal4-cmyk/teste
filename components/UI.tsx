import React from 'react';
import { GameState } from '../types';

interface UIProps {
  gameState: GameState;
  onStart: () => void;
  onReset: () => void;
  geminiText: string;
  isLoadingAi: boolean;
  timer: number;
}

const UI: React.FC<UIProps> = ({ gameState, onStart, onReset, geminiText, isLoadingAi, timer }) => {
  if (gameState === GameState.PLAYING) {
    return (
      <>
        <div className="crosshair">
          <div className="crosshair-dot"></div>
        </div>
        <div className="absolute top-4 left-4 text-white font-mono text-xl bg-black/50 p-2 rounded border border-white/20">
          TIME: {timer.toFixed(2)}s
        </div>
        <div className="absolute top-4 right-4 text-white/80 font-mono text-sm bg-black/50 p-2 rounded max-w-xs text-right border border-white/20">
          <p className="text-xs text-cyan-400 font-bold mb-1">MISSION CONTROL</p>
          {geminiText}
        </div>
        <div className="absolute bottom-4 left-4 text-white/50 text-sm font-mono">
          [WASD] Move [SPACE] Jump [SHIFT] Sprint
        </div>
      </>
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50 text-white">
      <h1 className="text-6xl font-black italic tracking-tighter mb-2 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
        SKY RUNNER
      </h1>
      <h2 className="text-xl font-mono text-gray-400 mb-8">AI-ENHANCED PARKOUR</h2>

      <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 max-w-md w-full text-center shadow-2xl">
        
        {gameState === GameState.FINISHED && (
           <div className="mb-6">
             <p className="text-3xl font-bold text-green-400 mb-2">COURSE CLEARED</p>
             <p className="text-xl mb-4">Final Time: <span className="font-mono text-white">{timer.toFixed(2)}s</span></p>
           </div>
        )}

        {gameState === GameState.FAILED && (
           <div className="mb-6">
             <p className="text-3xl font-bold text-red-500 mb-2">CRITICAL FAILURE</p>
           </div>
        )}

        <div className="min-h-[80px] flex items-center justify-center mb-6 p-4 bg-black/40 rounded border-l-4 border-cyan-500">
          {isLoadingAi ? (
            <div className="animate-pulse text-cyan-400 font-mono">Extracting data stream...</div>
          ) : (
            <p className="italic text-gray-300 font-mono text-sm">"{geminiText}"</p>
          )}
        </div>

        <button
          onClick={gameState === GameState.MENU ? onStart : onReset}
          className="w-full py-4 bg-white text-black font-bold text-lg uppercase tracking-widest hover:bg-cyan-400 hover:scale-105 transition-all duration-200"
        >
          {gameState === GameState.MENU ? 'Initialize Link' : 'Re-Deploy'}
        </button>
      </div>
    </div>
  );
};

export default UI;