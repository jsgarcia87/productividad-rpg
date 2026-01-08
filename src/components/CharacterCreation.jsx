import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sword, Wand, Zap } from 'lucide-react';

const CharacterCreation = () => {
    const { actions } = useGame();
    const [name, setName] = useState('');
    const [selectedClass, setSelectedClass] = useState('Warrior');

    const classes = [
        {
            id: 'Warrior',
            icon: <Sword size={48} />,
            desc: 'Master of strength. Deals high damage.',
            stats: 'STR +5'
        },
        {
            id: 'Mage',
            icon: <Wand size={48} />,
            desc: 'Master of intellect. Balanced and wise.',
            stats: 'INT +5'
        },
        {
            id: 'Rogue',
            icon: <Zap size={48} />,
            desc: 'Master of agility. Critical hits.',
            stats: 'DEX +5'
        },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            actions.createCharacter(name, selectedClass);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-8">
            <h1 className="text-4xl text-accent-green mb-8">CHOOSE YOUR HERO</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
                {classes.map((c) => (
                    <div
                        key={c.id}
                        onClick={() => setSelectedClass(c.id)}
                        className={`
              cursor-pointer border-4 p-6 flex flex-col items-center space-y-4 transition-all
              ${selectedClass === c.id ? 'border-accent-green bg-dark-800 scale-105' : 'border-gray-700 bg-dark-800/50 hover:border-gray-500'}
            `}
                    >
                        <div className={`${selectedClass === c.id ? 'text-accent-green' : 'text-gray-400'}`}>
                            {c.icon}
                        </div>
                        <h2 className="text-2xl">{c.id}</h2>
                        <p className="text-center text-gray-400 text-lg">{c.desc}</p>
                        <span className="text-accent-green font-bold">{c.stats}</span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 w-full max-w-md mt-8">
                <label className="text-2xl">HERO NAME</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-dark-800 border-2 border-gray-600 p-3 text-2xl focus:border-accent-green outline-none text-center"
                    placeholder="Enter Name..."
                    maxLength={15}
                    required
                />
                <button
                    type="submit"
                    className="bg-accent-green text-dark-900 text-2xl px-12 py-3 font-bold hover:bg-green-400 transition-colors mt-4 w-full border-b-4 border-green-700 active:translate-y-1 active:border-b-0"
                >
                    START ADVENTURE
                </button>
            </form>
        </div>
    );
};

export default CharacterCreation;
