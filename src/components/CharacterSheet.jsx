import React from 'react';
import { useGame } from '../context/GameContext';
import { Heart, Star, Shield, Clock, Coins } from 'lucide-react';

const CharacterSheet = () => {
    const { state } = useGame();
    const { character } = state;

    if (!character) return null;

    const hpPercent = (character.hp.current / character.hp.max) * 100;
    const xpPercent = (character.xp.current / character.xp.max) * 100;

    return (
        <div className="bg-dark-800 border-4 border-gray-700 p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center space-x-4 border-b-2 border-gray-700 pb-4">
                <div className="w-16 h-16 bg-gray-600 rounded-none border-2 border-white"></div> {/* Avatar Placeholder */}
                <div>
                    <h2 className="text-2xl font-bold text-white">{character.name}</h2>
                    <p className="text-accent-green text-lg">Lvl {character.level} {character.class}</p>
                </div>
            </div>

            {/* Bars */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-red-500"><Heart size={16} /> HP</span>
                    <span>{character.hp.current}/{character.hp.max}</span>
                </div>
                <div className="w-full h-4 bg-gray-900 border border-gray-600">
                    <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${hpPercent}%` }}></div>
                </div>

                <div className="flex items-center justify-between text-sm mt-2">
                    <span className="flex items-center gap-1 text-yellow-500"><Star size={16} /> XP</span>
                    <span>{character.xp.current}/{character.xp.max}</span>
                </div>
                <div className="w-full h-4 bg-gray-900 border border-gray-600">
                    <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${xpPercent}%` }}></div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-lg mt-4">
                <div className="bg-dark-900 p-2 border border-gray-700">
                    <span className="block text-gray-400 text-sm">STR</span>
                    <span className="font-bold text-white">{character.stats.str}</span>
                </div>
                <div className="bg-dark-900 p-2 border border-gray-700">
                    <span className="block text-gray-400 text-sm">INT</span>
                    <span className="font-bold text-white">{character.stats.int}</span>
                </div>
                <div className="bg-dark-900 p-2 border border-gray-700">
                    <span className="block text-gray-400 text-sm">DEX</span>
                    <span className="font-bold text-white">{character.stats.dex}</span>
                </div>
            </div>

            {/* Currencies */}
            <div className="flex justify-between items-center bg-dark-900 p-3 border border-gray-700 mt-4">
                <div className="flex items-center gap-2 text-yellow-400">
                    <Coins size={20} />
                    <span className="text-xl">{character.gold}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                    <Clock size={20} />
                    <span className="text-xl">{character.timePoints}m</span>
                </div>
            </div>
        </div>
    );
};
export default CharacterSheet;
