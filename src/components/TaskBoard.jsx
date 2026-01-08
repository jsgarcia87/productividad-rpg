import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Plus, Skull, Trash2, Sword } from 'lucide-react';

const TaskBoard = () => {
    const { state, actions } = useGame();
    const { tasks } = state;
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [difficulty, setDifficulty] = useState(1);
    const [dueDate, setDueDate] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleAddTask = (e) => {
        e.preventDefault();
        if (newTaskTitle.trim()) {
            actions.addTask(newTaskTitle, difficulty, dueDate);
            setNewTaskTitle('');
            setDueDate(''); // Reset
            setIsAdding(false);
        }
    };

    return (
        <div className="bg-dark-800 border-4 border-gray-700 p-4 h-full flex flex-col relative text-white">
            <div className="flex justify-between items-center mb-6 border-b-2 border-gray-600 pb-2">
                <h2 className="text-3xl font-pixel text-white">QUEST BOARD</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-accent-green text-dark-900 p-2 hover:bg-green-400 active:translate-y-1 transition-all border-b-4 border-green-800 active:border-b-0"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Add Task Form */}
            {isAdding && (
                <form onSubmit={handleAddTask} className="mb-6 bg-dark-900 p-4 border-2 border-dashed border-gray-600 animate-in slide-in-from-top-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="New Quest Name..."
                        className="w-full bg-dark-800 border border-gray-600 p-2 mb-2 text-white outline-none focus:border-accent-green"
                        autoFocus
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-dark-800 border border-gray-600 p-2 mb-2 text-white outline-none focus:border-accent-green"
                    />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">Difficulty:</span>
                            {[1, 2, 3, 4, 5].map(lvl => (
                                <button
                                    key={lvl}
                                    type="button"
                                    onClick={() => setDifficulty(lvl)}
                                    className={`w-8 h-8 flex items-center justify-center border ${difficulty === lvl ? 'bg-red-900 border-red-500 text-white' : 'border-gray-600 text-gray-500'}`}
                                >
                                    {lvl}
                                </button>
                            ))}
                        </div>
                        <button type="submit" className="bg-accent-green text-dark-900 px-4 py-1 font-bold hover:bg-green-400">
                            ADD
                        </button>
                    </div>
                </form>
            )}

            {/* Task List */}
            <div className="space-y-3 overflow-y-auto flex-grow pr-2 scrollbar-thin scrollbar-thumb-gray-600 text-white">
                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 opacity-50">
                        <p className="text-xl uppercase font-pixel">No active quests</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <div key={task.id} className="group relative bg-dark-900 border border-gray-600 p-3 hover:border-gray-400 transition-all flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-lg font-pixel tracking-wide">{task.title}</span>
                                {task.dueDate && <span className="text-xs text-gray-500">Due: {task.dueDate}</span>}
                                <div className="flex gap-1 mt-1">
                                    {Array.from({ length: task.difficulty }).map((_, i) => (
                                        <Skull key={i} size={14} className="text-red-500" />
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => actions.completeTask(task.id)}
                                    className="bg-red-600 text-white p-2 hover:bg-red-500 active:scale-95"
                                    title="Complete Task (Attack)"
                                >
                                    <Sword size={20} />
                                </button>
                                <button
                                    onClick={() => actions.deleteTask(task.id)}
                                    className="bg-gray-700 text-gray-300 p-2 hover:bg-gray-600 active:scale-95"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default TaskBoard;
