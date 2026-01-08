import React, { createContext, useContext, useEffect, useReducer } from 'react';

const GameContext = createContext();

const initialState = {
    character: null,
    tasks: [],
    rewards: [
        { id: 'netflix', name: '1 Episode of Netflix', cost: 30, type: 'time' },
        { id: 'game', name: '30min Gaming', cost: 30, type: 'time' },
    ],
    log: [], // Array of { id, message, type: 'damage'|'info'|'reward', timestamp }
    activeDungeon: { hp: 1000, maxHp: 1000, name: "Daily Dungeon" } // Placeholder
};

const rollD20 = () => Math.floor(Math.random() * 20) + 1;

const gameReducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_CHARACTER':
            return {
                ...state,
                character: {
                    name: action.payload.name,
                    class: action.payload.class,
                    stats: action.payload.stats,
                    hp: { current: 100, max: 100 },
                    xp: { current: 0, max: 100 },
                    level: 1,
                    gold: 0,
                    timePoints: 0,
                    inventory: [],
                },
            };

        case 'ADD_TASK':
            return { ...state, tasks: [...state.tasks, action.payload] };

        case 'BUY_ITEM': {
            const item = action.payload;
            if (state.character.gold < item.cost) return state;

            let newStats = { ...state.character.stats };
            let newHp = { ...state.character.hp };

            if (item.effect.str) newStats.str += item.effect.str;
            if (item.effect.int) newStats.int += item.effect.int;
            if (item.effect.dex) newStats.dex += item.effect.dex;
            if (item.effect.hp) newHp.current = Math.min(newHp.max, newHp.current + item.effect.hp);

            return {
                ...state,
                character: {
                    ...state.character,
                    gold: state.character.gold - item.cost,
                    stats: newStats,
                    hp: newHp,
                    inventory: [...state.character.inventory, item.id] // simplified
                },
                log: [{ id: Date.now(), message: `Bought ${item.name}`, type: 'info' }, ...state.log]
            };
        }

        case 'SPEND_TIME':
            return {
                ...state,
                character: {
                    ...state.character,
                    timePoints: state.character.timePoints - action.payload
                },
                log: [{ id: Date.now(), message: `Spent ${action.payload} minutes on reward.`, type: 'info' }, ...state.log]
            };

        case 'ADD_REWARD':
            return { ...state, rewards: [...state.rewards, action.payload] };

        case 'DELETE_REWARD':
            return { ...state, rewards: state.rewards.filter(r => r.id !== action.payload) };

        case 'INIT_REWARDS':
            return {
                ...state,
                rewards: [
                    { id: 'netflix', name: '1 Episode of Netflix', cost: 30, type: 'time' },
                    { id: 'game', name: '30min Gaming', cost: 30, type: 'time' },
                ]
            };

        case 'FINISH_POMODORO': {
            // Pomodoro rewards: 50 Damage, 25 Gold, 25 Time Points
            const damage = 50;
            const goldGain = 25;
            const timeGain = 25;
            const newDungeonHp = Math.max(0, state.activeDungeon.hp - damage);

            return {
                ...state,
                character: {
                    ...state.character,
                    gold: state.character.gold + goldGain,
                    timePoints: state.character.timePoints + timeGain
                },
                activeDungeon: { ...state.activeDungeon, hp: newDungeonHp },
                log: [{ id: Date.now(), message: `FOCUS SESSION COMPLETE! Dealt ${damage} CRITICAL DMG! +${goldGain} Gold, +${timeGain} Time Points.`, type: 'damage' }, ...state.log]
            }
        }

        case 'DELETE_TASK':
            return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };

        case 'COMPLETE_TASK': {
            const task = state.tasks.find(t => t.id === action.payload);
            if (!task || !state.character) return state;

            // Combat Logic
            const { class: charClass, stats } = state.character;
            let modifier = 0;
            if (charClass === 'Warrior') modifier = stats.str;
            if (charClass === 'Mage') modifier = stats.int;
            if (charClass === 'Rogue') modifier = stats.dex;

            // Stat modifier usually is (Stat - 10) / 2 in D&D, but prompt implies direct usage or simpler.
            // "Daño = (d20 + Atributo_Clase) * ND_Tarea" -> Implies direct attribute value (e.g. 15).

            const d20 = rollD20();
            const damage = (d20 + modifier) * task.difficulty;

            // XP Calculation
            const xpGain = task.difficulty * 10;

            // Gold Calculation
            const goldGain = task.difficulty * 5;

            // Update Character
            const newXp = state.character.xp.current + xpGain;
            const levelUp = newXp >= state.character.xp.max;

            let charUpdate = {
                ...state.character,
                xp: {
                    ...state.character.xp,
                    current: levelUp ? newXp - state.character.xp.max : newXp,
                    max: levelUp ? Math.floor(state.character.xp.max * 1.5) : state.character.xp.max
                },
                level: levelUp ? state.character.level + 1 : state.character.level,
                gold: state.character.gold + goldGain,
                // Stats increase on level up? "Evolución: ... desbloquee nuevas habilidades". Prompt says "increase damage".
                // We'll add +1 to primary stat on level up for simple scaling.
                stats: levelUp ? {
                    ...stats,
                    str: charClass === 'Warrior' ? stats.str + 2 : stats.str + 1,
                    int: charClass === 'Mage' ? stats.int + 2 : stats.int + 1,
                    dex: charClass === 'Rogue' ? stats.dex + 2 : stats.dex + 1,
                } : stats
            };

            if (levelUp) {
                charUpdate.hp.max += 10;
                charUpdate.hp.current = charUpdate.hp.max; // Heal on level up
            }

            if (levelUp) {
                charUpdate.hp.max += 10;
                charUpdate.hp.current = charUpdate.hp.max; // Heal on level up
            }

            // Log
            const logEntry = {
                id: Date.now(),
                message: `Dealt ${damage} DMG! (d20:${d20} + ${modifier}) * ${task.difficulty}. +${xpGain} XP, +${goldGain} Gold.`,
                type: 'damage'
            };
            if (levelUp) {
                // We can push another log or combine
            }

            // Dungeon Dashboard update
            const newDungeonHp = Math.max(0, state.activeDungeon.hp - damage);

            return {
                ...state,
                character: charUpdate,
                tasks: state.tasks.filter(t => t.id !== action.payload), // Remove task on complete? Or mark completed? 
                // "Tareas son combates". Usuallly daily tasks reset, one-offs disappear. We'll delete for now.
                log: [logEntry, ...state.log],
                activeDungeon: { ...state.activeDungeon, hp: newDungeonHp }
            };
        }

        case 'CHECK_PENALTIES': {
            const today = new Date().toISOString().split('T')[0];
            let penalties = 0;
            let dmgTaken = 0;

            // This is a simple check: if strict, we'd check against stored "lastLogin" etc.
            // For now, checks if task is overdue RIGHT NOW.

            const overdueTasks = state.tasks.filter(t => t.dueDate && t.dueDate < today && !t.completed);

            if (overdueTasks.length === 0) return state;

            // Apply 5 damage per overdue task level
            overdueTasks.forEach(t => { dmgTaken += t.difficulty * 5; });

            let newHp = state.character.hp.current - dmgTaken;
            let goldPenalty = 0;

            if (newHp <= 0) {
                newHp = 0;
                goldPenalty = Math.floor(state.character.gold * 0.1); // Lose 10% gold on death
            }

            // Ideally mark tasks as "penalized" so we don't punish every reload?
            // This requires storing "lastPenaltyCheck" date.
            // We'll skip complex date logic for this MVP and assume user behaves or we use session.

            return {
                ...state,
                character: {
                    ...state.character,
                    hp: { ...state.character.hp, current: newHp },
                    gold: Math.max(0, state.character.gold - goldPenalty)
                },
                log: [{ id: Date.now(), message: `Overdue Tasks! Took ${dmgTaken} Damage. ${goldPenalty > 0 ? `fainted and lost ${goldPenalty} Gold.` : ''}`, type: 'info' }, ...state.log]
            };
        }

        case 'RESTORE_STATE':
            return action.payload;

        default:
            return state;
    }
};

export const GameProvider = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    useEffect(() => {
        const savedState = localStorage.getItem('rpg_productivity_save');
        if (savedState) {
            try {
                // Merge saved state with initial structure in case of schema changes
                const parsed = JSON.parse(savedState);
                if (parsed) {
                    dispatch({ type: 'RESTORE_STATE', payload: parsed });
                    // Check penalties after load
                    if (parsed.character) {
                        setTimeout(() => dispatch({ type: 'CHECK_PENALTIES' }), 1000);
                    }
                    if (!parsed.rewards) {
                        // Migration for existing saves that lack rewards
                        dispatch({ type: 'INIT_REWARDS' });
                    }
                }
            } catch (e) { console.error(e); }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('rpg_productivity_save', JSON.stringify(state));
    }, [state]);

    const actions = {
        createCharacter: (name, charClass) => {
            let stats = { str: 10, int: 10, dex: 10 };
            if (charClass === 'Warrior') stats.str += 5;
            if (charClass === 'Mage') stats.int += 5;
            if (charClass === 'Rogue') stats.dex += 5;
            dispatch({ type: 'CREATE_CHARACTER', payload: { name, class: charClass, stats } });
        },
        addTask: (title, difficulty, dueDate) => {
            const newTask = {
                id: Date.now().toString(),
                title,
                difficulty: parseInt(difficulty),
                dueDate,
                completed: false,
            };
            dispatch({ type: 'ADD_TASK', payload: newTask });
        },
        completeTask: (id) => {
            dispatch({ type: 'COMPLETE_TASK', payload: id });
        },
        deleteTask: (id) => {
            dispatch({ type: 'DELETE_TASK', payload: id });
        },
        finishPomodoro: () => {
            dispatch({ type: 'FINISH_POMODORO' });
        },
        addReward: (name, cost) => {
            dispatch({ type: 'ADD_REWARD', payload: { id: Date.now().toString(), name, cost: parseInt(cost), type: 'time' } });
        },
        deleteReward: (id) => {
            dispatch({ type: 'DELETE_REWARD', payload: id });
        }
    };

    return (
        <GameContext.Provider value={{ state, dispatch, actions }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);
