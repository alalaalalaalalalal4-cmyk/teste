import React, { useState, useEffect, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import UI from './components/UI';
import { GameState } from './types';
import { LEVELS } from './constants';
import { getMissionBriefing, getFailureCoach, getVictorySpeech } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0]);
  const [geminiText, setGeminiText] = useState<string>("Waiting for uplink...");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  
  const [startTime, setStartTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Timer Logic
  useEffect(() => {
    let interval: number;
    if (gameState === GameState.PLAYING) {
      setStartTime(Date.now());
      interval = window.setInterval(() => {
        setCurrentTime((Date.now() - startTime) / 1000);
      }, 50); // Update HUD frequently
    }
    return () => clearInterval(interval);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  // AI Fetching Logic
  const fetchAiContent = useCallback(async (state: GameState) => {
    setIsLoadingAi(true);
    let text = "";
    
    if (state === GameState.PLAYING) {
      text = await getMissionBriefing();
    } else if (state === GameState.FAILED) {
      text = await getFailureCoach();
    } else if (state === GameState.FINISHED) {
      text = await getVictorySpeech(currentTime);
    } else if (state === GameState.MENU) {
        text = "System ready. Awaiting pilot.";
    }

    setGeminiText(text);
    setIsLoadingAi(false);
  }, [currentTime]);

  // Watch state changes to trigger AI
  useEffect(() => {
    if (gameState !== GameState.MENU) {
        fetchAiContent(gameState);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  const handleStart = () => {
    setGameState(GameState.PLAYING);
    setStartTime(Date.now());
    setCurrentTime(0);
  };

  const handleReset = () => {
    setGameState(GameState.PLAYING);
    setStartTime(Date.now());
    setCurrentTime(0);
    // Force re-fetch briefing
    fetchAiContent(GameState.PLAYING);
  };

  return (
    <div className="relative w-full h-screen bg-black">
      <GameCanvas 
        gameState={gameState} 
        setGameState={setGameState}
        levelData={currentLevel}
      />
      <UI 
        gameState={gameState}
        onStart={handleStart}
        onReset={handleReset}
        geminiText={geminiText}
        isLoadingAi={isLoadingAi}
        timer={gameState === GameState.PLAYING ? (Date.now() - startTime) / 1000 : currentTime}
      />
    </div>
  );
};

export default App;