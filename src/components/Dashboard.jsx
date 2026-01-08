import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import CharacterSheet from './CharacterSheet';
import TaskBoard from './TaskBoard';
import Shop from './Shop';
import Pomodoro from './Pomodoro';
import { Sword, ShoppingBag } from 'lucide-react';

const Dashboard = () => {
    const { state } = useGame();
    const [shake, setShake] = useState(false);
    const [lastLogTime, setLastLogTime] = useState(0);
    const [activeTab, setActiveTab] = useState('quests');
    const [showPomodoro, setShowPomodoro] = useState(false);
    const { actions } = useGame();

    const handlePomodoroComplete = () => {
        actions.finishPomodoro();
        setShowPomodoro(false);
    };

    // Trigger shake on new damage log
    useEffect(() => {
        if (state.log.length > 0) {
            const latest = state.log[0];
            if (latest.type === 'damage' && latest.id > lastLogTime) {
                setShake(true);
                setLastLogTime(latest.id);
                setTimeout(() => setShake(false), 500);
            }
        }
    }, [state.log, lastLogTime]);

    return (
        <div className={`max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[calc(100vh-2rem)] ${shake ? 'animate-shake' : ''}`}>
            {/* Left Column: Character Sheet & Status */}
            <div className="md:col-span-4 lg:col-span-3 flex flex-col gap-6">
                <CharacterSheet />

                {/* Boss/Dungeon Status */}
                <div className="bg-dark-800 border-4 border-gray-700 p-4">
                    <h3 className="text-xl text-red-500 mb-2">CURRENT BOSS</h3>
                    <div className="w-full bg-gray-900 border border-red-900 h-6 relative">
                        <div
                            className="bg-red-700 h-full transition-all duration-500"
                            style={{ width: `${(state.activeDungeon.hp / state.activeDungeon.maxHp) * 100}%` }}
                        ></div>
                        <span className="absolute inset-0 flex items-center justify-center text-xs text-white shadow-black drop-shadow-md">
                            {state.activeDungeon.hp} / {state.activeDungeon.maxHp} HP
                        </span>
                    </div>
                </div>

                {/* Combat Log */}
                <div className="bg-dark-900 border border-gray-700 p-2 h-48 overflow-y-auto text-sm font-mono text-gray-400">
                    {state.log.map(entry => (
                        <div key={entry.id} className="mb-1 border-b border-gray-800 pb-1">
                            <span className="text-accent-green">{entry.type === 'damage' ? '⚔️' : 'ℹ️'}</span> {entry.message}
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => setShowPomodoro(true)}
                    className="bg-red-600 text-white text-2xl py-4 border-b-4 border-red-800 hover:bg-red-500 active:border-b-0 active:translate-y-1 transition-all font-bold tracking-widest animate-pulse mt-auto"
                >
                    FOCUS NOW
                </button>
            </div>

            {showPomodoro && (
                <Pomodoro
                    onComplete={handlePomodoroComplete}
                    onCancel={() => setShowPomodoro(false)}
                />
            )}

            {/* Right Column: Tasks & Shop */}
            <div className="md:col-span-8 lg:col-span-9 flex flex-col gap-4">
                {/* Navigation Tabs */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('quests')}
                        className={`flex-1 p-3 text-xl font-bold border-t-4 border-l-4 border-r-4 ${activeTab === 'quests' ? 'bg-dark-800 border-gray-700 text-white' : 'bg-dark-900 border-gray-800 text-gray-500 hover:bg-dark-800'}`}
                    >
                        <span className="flex items-center justify-center gap-2"><Sword /> QUESTS</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('shop')}
                        className={`flex-1 p-3 text-xl font-bold border-t-4 border-l-4 border-r-4 ${activeTab === 'shop' ? 'bg-dark-800 border-gray-700 text-white' : 'bg-dark-900 border-gray-800 text-gray-500 hover:bg-dark-800'}`}
                    >
                        <span className="flex items-center justify-center gap-2"><ShoppingBag /> SHOP</span>
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-grow">
                    {activeTab === 'quests' && <TaskBoard />}
                    {activeTab === 'shop' && <Shop />}
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
