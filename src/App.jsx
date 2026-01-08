import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import CharacterCreation from './components/CharacterCreation';
import Dashboard from './components/Dashboard';

const GameContent = () => {
  const { state } = useGame();

  if (!state.character) {
    return <CharacterCreation />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
