import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Coins, Clock, ShoppingBag, Gift, Plus, Trash2 } from 'lucide-react';

const Shop = () => {
    const { state, dispatch, actions } = useGame();
    const { character, rewards } = state;
    const [activeTab, setActiveTab] = useState('items'); // items | rewards

    // New Reward Form
    const [rewardName, setRewardName] = useState('');
    const [rewardCost, setRewardCost] = useState('');
    const [isAddingReward, setIsAddingReward] = useState(false);

    // Mock Items Data (Consumables/Gear still hardcoded for now or could move to state too)
    const items = [
        { id: 'potion', name: 'Health Potion', cost: 50, desc: 'Restore 50 HP', type: 'consumable', effect: { hp: 50 } },
        { id: 'sword', name: 'Steel Sword', cost: 100, desc: '+2 STR', type: 'gear', effect: { str: 2 } },
        { id: 'staff', name: 'Arcane Staff', cost: 100, desc: '+2 INT', type: 'gear', effect: { int: 2 } },
        { id: 'dagger', name: 'Shadow Dagger', cost: 100, desc: '+2 DEX', type: 'gear', effect: { dex: 2 } },
    ];

    const buyItem = (item) => {
        if (character.gold >= item.cost) {
            dispatch({ type: 'BUY_ITEM', payload: item });
        }
    };

    const buyReward = (reward) => {
        if (character.timePoints >= reward.cost) {
            dispatch({ type: 'SPEND_TIME', payload: reward.cost });
        }
    };

    const handleAddReward = (e) => {
        e.preventDefault();
        if (rewardName && rewardCost) {
            actions.addReward(rewardName, rewardCost);
            setRewardName('');
            setRewardCost('');
            setIsAddingReward(false);
        }
    };

    return (
        <div className="bg-dark-800 border-4 border-gray-700 p-4 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-600 pb-2">
                <h2 className="text-3xl font-pixel text-white">MARKETPLACE</h2>
                <div className="flex gap-4">
                    <button onClick={() => setActiveTab('items')} className={`flex items-center gap-2 ${activeTab === 'items' ? 'text-accent-green' : 'text-gray-400'}`}>
                        <ShoppingBag size={20} /> GEAR
                    </button>
                    <button onClick={() => setActiveTab('rewards')} className={`flex items-center gap-2 ${activeTab === 'rewards' ? 'text-accent-green' : 'text-gray-400'}`}>
                        <Gift size={20} /> REWARDS
                    </button>
                </div>
            </div>

            <div className="space-y-4 overflow-y-auto flex-grow pr-2">
                {activeTab === 'items' ? (
                    items.map(item => (
                        <div key={item.id} className="bg-dark-900 border border-gray-600 p-3 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg text-white font-bold">{item.name}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => buyItem(item)}
                                disabled={character.gold < item.cost}
                                className={`px-4 py-2 border rounded-none font-bold flex items-center gap-1 ${character.gold >= item.cost ? 'bg-yellow-600 text-white hover:bg-yellow-500 border-yellow-400' : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'}`}
                            >
                                <Coins size={16} /> {item.cost}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="space-y-4">
                        {/* Add Reward Button / Form */}
                        {isAddingReward ? (
                            <form onSubmit={handleAddReward} className="bg-dark-900 p-3 border border-dashed border-gray-500 animate-in fade-in">
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Reward Name (e.g. Netflix)"
                                        value={rewardName}
                                        onChange={e => setRewardName(e.target.value)}
                                        className="flex-grow bg-dark-800 border border-gray-600 p-2 text-white outline-none focus:border-accent-green"
                                        autoFocus
                                    />
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={rewardCost}
                                        onChange={e => setRewardCost(e.target.value)}
                                        className="w-20 bg-dark-800 border border-gray-600 p-2 text-white outline-none focus:border-accent-green"
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsAddingReward(false)} className="text-gray-400 hover:text-white">Cancel</button>
                                    <button type="submit" className="bg-accent-green text-dark-900 px-4 font-bold hover:bg-green-400">Save</button>
                                </div>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsAddingReward(true)}
                                className="w-full py-2 border-2 border-dashed border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white transition-all flex justify-center items-center gap-2"
                            >
                                <Plus size={20} /> Add Custom Reward
                            </button>
                        )}

                        {/* List */}
                        {rewards && rewards.map(reward => (
                            <div key={reward.id} className="bg-dark-900 border border-gray-600 p-3 flex justify-between items-center group">
                                <div>
                                    <h3 className="text-lg text-white font-bold">{reward.name}</h3>
                                    <p className="text-gray-400 text-sm">Cost: {reward.cost} min</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => buyReward(reward)}
                                        disabled={character.timePoints < reward.cost}
                                        className={`px-4 py-2 border rounded-none font-bold flex items-center gap-1 ${character.timePoints >= reward.cost ? 'bg-blue-600 text-white hover:bg-blue-500 border-blue-400' : 'bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed'}`}
                                    >
                                        <Clock size={16} /> {reward.cost}
                                    </button>
                                    <button
                                        onClick={() => actions.deleteReward(reward.id)}
                                        className="p-2 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Delete Reward"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default Shop;
