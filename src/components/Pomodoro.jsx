import React, { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';

const Pomodoro = ({ onComplete, onCancel }) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            onComplete();
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const toggleTimer = () => setIsActive(!isActive);

    // Format mm:ss
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-dark-900 z-50 flex flex-col items-center justify-center space-y-8 animate-in fade-in">
            <h1 className="text-6xl text-white font-pixel animate-pulse">FOCUS MODE</h1>

            <div className="text-9xl font-bold text-accent-green font-mono border-8 border-gray-700 p-8 bg-black rounded-lg shadow-[0_0_50px_rgba(74,222,128,0.2)]">
                {formatTime(timeLeft)}
            </div>

            <div className="flex gap-4">
                <button
                    onClick={toggleTimer}
                    className="bg-white text-dark-900 px-8 py-4 text-2xl font-bold hover:bg-gray-200 active:scale-95 transition-all flex items-center gap-2"
                >
                    {isActive ? <><Pause /> PAUSE</> : <><Play /> START</>}
                </button>

                <button
                    onClick={onCancel}
                    className="bg-red-600 text-white px-8 py-4 text-2xl font-bold hover:bg-red-500 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Square /> EXIT
                </button>
            </div>

            <p className="text-gray-400 text-xl max-w-md text-center">
                Keep this window open. Completing this session deals CRITICAL DAMAGE to the current boss and rewards Time Points.
            </p>
        </div>
    );
};
export default Pomodoro;
