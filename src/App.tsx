import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import { saveGameProgress, loadGameProgress } from './firebase';

export default function ButterClicker() {
  const { user, loading, signIn, logOut } = useAuth();
  
  // Game state
  const [butter, setButter] = useState(0);
  const [totalButter, setTotalButter] = useState(0);
  const [bps, setBps] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [level, setLevel] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [prestige, setPrestige] = useState(0);
  const [prestigeBonus, setPrestigeBonus] = useState(1);
  const [multiplierTime, setMultiplierTime] = useState(0);
  const [eventClicks, setEventClicks] = useState(0);
  const [showFloat, setShowFloat] = useState<Array<{ id: number; text: string; emoji?: string; x?: number; y?: number; isClick?: boolean }>>([]);
  const [goldenButter, setGoldenButter] = useState<Array<{ id: number; visible: boolean; x: number; y: number; color: string; level?: number; colorHex?: string; reward?: number }>>([]);
  const [showAchievements, setShowAchievements] = useState(false);
  const notifiedAchievements = useRef<Set<number>>(new Set());
  
  const [buildings, setBuildings] = useState([
    { name: 'Fouet', count: 0, cost: 50, baseCost: 50, bps: 0.1, emoji: '🥄', color: 'from-gray-400 to-gray-500' },
    { name: 'Crémaillère', count: 0, cost: 500, baseCost: 500, bps: 1, emoji: '🍳', color: 'from-orange-400 to-red-500' },
    { name: 'Ferme laitière', count: 0, cost: 5500, baseCost: 5500, bps: 8, emoji: '🐄', color: 'from-green-400 to-emerald-500' },
    { name: 'Baratte', count: 0, cost: 60000, baseCost: 60000, bps: 47, emoji: '🪣', color: 'from-blue-400 to-cyan-500' },
    { name: 'Laiterie', count: 0, cost: 650000, baseCost: 650000, bps: 260, emoji: '🏭', color: 'from-purple-400 to-violet-500' },
    { name: 'Fromagerie', count: 0, cost: 7000000, baseCost: 7000000, bps: 1400, emoji: '🧀', color: 'from-yellow-400 to-amber-500' },
    { name: 'Usine', count: 0, cost: 100000000, baseCost: 100000000, bps: 7800, emoji: '🏗️', color: 'from-red-400 to-pink-500' },
    { name: 'Château', count: 0, cost: 1650000000, baseCost: 1650000000, bps: 44000, emoji: '🏰', color: 'from-indigo-400 to-purple-500' },
    { name: 'Dimension', count: 0, cost: 44500000000, baseCost: 44500000000, bps: 260000, emoji: '🌌', color: 'from-pink-400 to-rose-500' },
    { name: 'Galaxie', count: 0, cost: 1000000000000, baseCost: 1000000000000, bps: 1600000, emoji: '🌀', color: 'from-cyan-400 to-blue-500' },
    { name: 'Univers', count: 0, cost: 26500000000000, baseCost: 26500000000000, bps: 10000000, emoji: '🌠', color: 'from-violet-400 to-purple-500' },
    { name: 'Réalité', count: 0, cost: 750000000000000, baseCost: 750000000000000, bps: 65000000, emoji: '⚡', color: 'from-yellow-300 to-orange-500' },
    { name: 'Nexus', count: 0, cost: 20000000000000000, baseCost: 20000000000000000, bps: 430000000, emoji: '🔮', color: 'from-red-400 to-pink-500' },
    { name: 'Singularité', count: 0, cost: 600000000000000000, baseCost: 600000000000000000, bps: 2900000000, emoji: '⚫', color: 'from-gray-600 to-gray-800' },
    { name: 'Omnivers', count: 0, cost: 17500000000000000000, baseCost: 17500000000000000000, bps: 21000000000, emoji: '🌈', color: 'from-fuchsia-400 to-cyan-500' },
    { name: 'Hyperespace', count: 0, cost: 600000000000000000000, baseCost: 600000000000000000000, bps: 180000000000, emoji: '🌌', color: 'from-blue-600 to-violet-600' },
    { name: 'Métavers', count: 0, cost: 25000000000000000000000, baseCost: 25000000000000000000000, bps: 1500000000000, emoji: '🎮', color: 'from-purple-600 to-pink-600' },
    { name: 'Infinité', count: 0, cost: 1100000000000000000000000, baseCost: 1100000000000000000000000, bps: 13000000000000, emoji: '♾️', color: 'from-yellow-500 to-red-600' },
    { name: 'Transcendance', count: 0, cost: 50000000000000000000000000, baseCost: 50000000000000000000000000, bps: 120000000000000, emoji: '✨', color: 'from-indigo-600 to-purple-600' },
    { name: 'Armageddon', count: 0, cost: 2500000000000000000000000000, baseCost: 2500000000000000000000000000, bps: 1200000000000000, emoji: '💥', color: 'from-red-600 to-orange-600' },
    { name: 'Apocalypse', count: 0, cost: 150000000000000000000000000000, baseCost: 150000000000000000000000000000, bps: 12000000000000000, emoji: '🔥', color: 'from-orange-600 to-red-600' },
    { name: 'Divinité', count: 0, cost: 10000000000000000000000000000000, baseCost: 10000000000000000000000000000000, bps: 140000000000000000, emoji: '👑', color: 'from-yellow-400 to-yellow-600' },
  ]);
  
  const [upgrades, setUpgrades] = useState([
    { id: 1, name: 'Spatule', cost: 500, baseCost: 500, count: 0, clickBonus: 1, requirement: 0, icon: '🍴' },
    { id: 2, name: 'Gants', cost: 2500, baseCost: 2500, count: 0, clickBonus: 2, requirement: 100, icon: '🧤' },
    { id: 3, name: 'Tablier', cost: 25000, baseCost: 25000, count: 0, clickBonus: 5, requirement: 1000, icon: '👔' },
    { id: 4, name: 'Batteur', cost: 250000, baseCost: 250000, count: 0, clickBonus: 10, requirement: 10000, icon: '⚡' },
    { id: 5, name: 'Mixeur', cost: 2500000, baseCost: 2500000, count: 0, clickBonus: 25, requirement: 100000, icon: '🌟' },
    { id: 6, name: 'Robot', cost: 25000000, baseCost: 25000000, count: 0, clickBonus: 50, requirement: 1000000, icon: '🤖' },
    { id: 7, name: 'IA Beurre', cost: 500000000, baseCost: 500000000, count: 0, clickBonus: 250, requirement: 10000000, icon: '🧠' },
    { id: 8, name: 'Nano-Tech', cost: 10000000000, baseCost: 10000000000, count: 0, clickBonus: 1000, requirement: 100000000, icon: '⚛️' },
    { id: 9, name: 'Quantum', cost: 250000000000, baseCost: 250000000000, count: 0, clickBonus: 5000, requirement: 1000000000, icon: '🔮' },
    { id: 10, name: 'Cyborg', cost: 6000000000000, baseCost: 6000000000000, count: 0, clickBonus: 25000, requirement: 10000000000, icon: '🦾' },
    { id: 11, name: 'Divin', cost: 175000000000000, baseCost: 175000000000000, count: 0, clickBonus: 150000, requirement: 100000000000, icon: '✨' },
    { id: 12, name: 'Cosmique', cost: 5000000000000000, baseCost: 5000000000000000, count: 0, clickBonus: 900000, requirement: 1000000000000, icon: '🌌' },
    { id: 13, name: 'Eternal', cost: 150000000000000000, baseCost: 150000000000000000, count: 0, clickBonus: 5000000, requirement: 10000000000000, icon: '♾️' },
    { id: 14, name: 'Chaos', cost: 4500000000000000000, baseCost: 4500000000000000000, count: 0, clickBonus: 30000000, requirement: 100000000000000, icon: '🌪️' },
    { id: 15, name: 'Absolu', cost: 135000000000000000000, baseCost: 135000000000000000000, count: 0, clickBonus: 200000000, requirement: 1000000000000000, icon: '💯' },
    { id: 16, name: 'Chrono', cost: 375000, baseCost: 375000, count: 0, clickBonus: 3, requirement: 5000, icon: '⏰' },
    { id: 17, name: 'Hyper', cost: 3750000, baseCost: 3750000, count: 0, clickBonus: 15, requirement: 50000, icon: '💥' },
    { id: 18, name: 'Mega', cost: 37500000, baseCost: 37500000, count: 0, clickBonus: 75, requirement: 500000, icon: '📈' },
    { id: 19, name: 'Giga', cost: 375000000, baseCost: 375000000, count: 0, clickBonus: 400, requirement: 5000000, icon: '🎯' },
    { id: 20, name: 'Tera', cost: 3750000000, baseCost: 3750000000, count: 0, clickBonus: 2000, requirement: 50000000, icon: '🚀' },
    { id: 21, name: 'Peta', cost: 4500000000000000000000, baseCost: 4500000000000000000000, count: 0, clickBonus: 1500000000, requirement: 500000000000000, icon: '⭐' },
    { id: 22, name: 'Exa', cost: 180000000000000000000000, baseCost: 180000000000000000000000, count: 0, clickBonus: 15000000000, requirement: 5000000000000000, icon: '🌟' },
    { id: 23, name: 'Zetta', cost: 9000000000000000000000000, baseCost: 9000000000000000000000000, count: 0, clickBonus: 180000000000, requirement: 50000000000000000, icon: '💫' },
    { id: 24, name: 'Yotta', cost: 450000000000000000000000000, baseCost: 450000000000000000000000000, count: 0, clickBonus: 2500000000000, requirement: 500000000000000000, icon: '🔆' },
    { id: 25, name: 'Omnipotent', cost: 25000000000000000000000000000, baseCost: 25000000000000000000000000000, count: 0, clickBonus: 35000000000000, requirement: 5000000000000000000, icon: '👹' },
    { id: 26, name: 'Transcendent', cost: 1500000000000000000000000000000, baseCost: 1500000000000000000000000000000, count: 0, clickBonus: 500000000000000, requirement: 50000000000000000000, icon: '🧬' },
    { id: 27, name: 'Dieu', cost: 100000000000000000000000000000000, baseCost: 100000000000000000000000000000000, count: 0, clickBonus: 8000000000000000, requirement: 500000000000000000000, icon: '⚡' },
    { id: 28, name: 'Suprême', cost: 7500000000000000000000000000000000, baseCost: 7500000000000000000000000000000000, count: 0, clickBonus: 140000000000000000, requirement: 5000000000000000000000, icon: '🏆' },
    { id: 29, name: 'Infini', cost: 600000000000000000000000000000000000, baseCost: 600000000000000000000000000000000000, count: 0, clickBonus: 2500000000000000000, requirement: 50000000000000000000000, icon: '∞' },
    { id: 30, name: 'Absolu+', cost: 50000000000000000000000000000000000000, baseCost: 50000000000000000000000000000000000000, count: 0, clickBonus: 50000000000000000000, requirement: 500000000000000000000000, icon: '🌀' },
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, name: 'Premier beurre', desc: 'Cliquer 1 fois', unlocked: false, requirement: 1, emoji: '🧈', type: 'click' },
    { id: 2, name: 'Amateur', desc: '100 beurres', unlocked: false, requirement: 100, emoji: '🥇', type: 'total' },
    { id: 3, name: 'Pro', desc: '1K beurres', unlocked: false, requirement: 1000, emoji: '🥈', type: 'total' },
    { id: 4, name: 'Maître', desc: '10K beurres', unlocked: false, requirement: 10000, emoji: '🥉', type: 'total' },
    { id: 5, name: 'Employé', desc: '1 bâtiment', unlocked: false, requirement: 1, emoji: '🏢', type: 'building' },
    { id: 6, name: 'Empire', desc: '50 bâtiments', unlocked: false, requirement: 50, emoji: '🏛️', type: 'building' },
    { id: 7, name: 'Million', desc: '1M beurres', unlocked: false, requirement: 1000000, emoji: '💎', type: 'total' },
    { id: 8, name: 'Milliard', desc: '1B beurres', unlocked: false, requirement: 1000000000, emoji: '👑', type: 'total' },
    { id: 9, name: 'Billionaire', desc: '1T beurres', unlocked: false, requirement: 1000000000000, emoji: '💰', type: 'total' },
    { id: 10, name: 'Quadrillionaire', desc: '1Q beurres', unlocked: false, requirement: 1000000000000000, emoji: '🌟', type: 'total' },
    { id: 11, name: 'Collector', desc: 'Tous les bâtiments', unlocked: false, requirement: 15, emoji: '🎪', type: 'building' },
    { id: 12, name: 'Enhancer', desc: 'Tous les améliorations', unlocked: false, requirement: 20, emoji: '⚙️', type: 'upgrade' },
    { id: 13, name: 'Clicker Fou', desc: '10K clics', unlocked: false, requirement: 10000, emoji: '🖱️', type: 'click' },
    { id: 14, name: 'Speedrunner', desc: '100K clics', unlocked: false, requirement: 100000, emoji: '💨', type: 'click' },
    { id: 15, name: 'Prestigieux', desc: 'Faire 1 prestige', unlocked: false, requirement: 1, emoji: '👑', type: 'prestige' },
    { id: 16, name: 'Collecteur Fou', desc: '25 bâtiments', unlocked: false, requirement: 25, emoji: '🎪', type: 'building' },
    { id: 17, name: 'Enhancer Extrême', desc: '30 améliorations', unlocked: false, requirement: 30, emoji: '⚙️', type: 'upgrade' },
    { id: 18, name: 'Milliardaire', desc: '1B beurres', unlocked: false, requirement: 1000000000, emoji: '💰', type: 'total' },
    { id: 19, name: 'Billionnaire', desc: '1T beurres', unlocked: false, requirement: 1000000000000, emoji: '💎', type: 'total' },
    { id: 20, name: 'Cliqueur Divin', desc: '100K clics', unlocked: false, requirement: 100000, emoji: '⚡', type: 'click' },
    { id: 21, name: 'Hyperespace', desc: '10 Hyperespace', unlocked: false, requirement: 10, emoji: '🚀', type: 'building' },
    { id: 22, name: 'Divinité', desc: '5 Divinité', unlocked: false, requirement: 5, emoji: '✨', type: 'building' },
    { id: 23, name: 'Glorieux', desc: 'Faire 10 prestige', unlocked: false, requirement: 10, emoji: '🌟', type: 'prestige' },
    { id: 24, name: 'Suprématiste', desc: 'Acheter l\'upgrade Suprême', unlocked: false, requirement: 1, emoji: '🏆', type: 'upgrade' },
    { id: 25, name: 'Beurre Infini', desc: '1Qa beurres', unlocked: false, requirement: 1000000000000000, emoji: '♾️', type: 'total' },
    { id: 26, name: 'Event Hunter', desc: 'Cliquer sur 5 événements', unlocked: false, requirement: 5, emoji: '✨', type: 'event' },
    { id: 27, name: 'Event Master', desc: 'Cliquer sur 25 événements', unlocked: false, requirement: 25, emoji: '⭐', type: 'event' },
    { id: 28, name: 'Event Legendary', desc: 'Cliquer sur 100 événements', unlocked: false, requirement: 100, emoji: '🎯', type: 'event' },
    { id: 29, name: 'Chasseur de Rareté', desc: 'Cliquer sur un événement orange', unlocked: false, requirement: 1, emoji: '🔥', type: 'eventLevel' },
    { id: 30, name: 'Collectionneur d\'Events', desc: 'Cliquer sur tous les niveaux d\'événement', unlocked: false, requirement: 5, emoji: '💫', type: 'eventLevelAll' },
  ]);

  // Format number helper
  const fmt = useCallback((n: number) => {
    if (n >= 1e15) return (n / 1e15).toFixed(2) + 'Qa';
    if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
    if (n < 1) return n.toFixed(2);
    return Math.floor(n).toString();
  }, []);

  // Notification helper
  const notify = useCallback((text: string, emoji: string = '🎉') => {
    const id = Date.now();
    setShowFloat(prev => [...prev, { id, text, emoji }]);
    setTimeout(() => setShowFloat(prev => prev.filter(f => f.id !== id)), 3000);
  }, []);

  // Production auto
  useEffect(() => {
    const interval = setInterval(() => {
      setButter(prev => prev + (bps * multiplier * prestigeBonus / 10));
      setTotalButter(prev => prev + (bps * multiplier * prestigeBonus / 10));
    }, 100);
    return () => clearInterval(interval);
  }, [bps, multiplier, prestigeBonus]);

  // Calculate BPS
  useEffect(() => {
    const total = buildings.reduce((sum, b) => sum + (b.count * b.bps), 0);
    setBps(total * prestigeBonus);
  }, [buildings, prestigeBonus]);

  // Calculate level
  useEffect(() => {
    setLevel(Math.floor(Math.log10(totalButter + 1)) + 1);
  }, [totalButter]);

  // Multiplier timer
  useEffect(() => {
    if (multiplierTime <= 0 && multiplier > 1) {
      setMultiplier(1);
      return;
    }
    if (multiplierTime <= 0) return;
    const timer = setTimeout(() => setMultiplierTime(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [multiplierTime, multiplier]);

  // Falling butter spawn with event levels
  useEffect(() => {
    const eventLevels = [
      { level: 1, color: '#00BFFF', chance: 0.003, reward: 10, emoji: '🧈' },
      { level: 2, color: '#00FF00', chance: 0.004, reward: 50, emoji: '🧈' },
      { level: 3, color: '#FFD700', chance: 0.001, reward: 200, emoji: '🧈' },
      { level: 4, color: '#FF1493', chance: 0.0003, reward: 1000, emoji: '🧈' },
      { level: 5, color: '#FF4500', chance: 0.0001, reward: 5000, emoji: '🧈' }
    ];
    
    const interval = setInterval(() => {
      for (const event of eventLevels) {
        if (Math.random() < event.chance) {
          const newButter = {
            id: Date.now() + Math.random(),
            visible: true,
            x: Math.random() * 90 + 5,
            y: -50,
            color: event.emoji,
            colorHex: event.color,
            level: event.level,
            reward: event.reward
          };
          setGoldenButter(prev => [...prev, newButter]);
          
          // Remove after animation completes
          setTimeout(() => {
            setGoldenButter(prev => prev.filter(b => b.id !== newButter.id));
          }, 5000);
          break;
        }
      }
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Achievements check
  useEffect(() => {
    const totalBuildings = buildings.reduce((sum, b) => sum + b.count, 0);
    const boughtUpgrades = upgrades.reduce((sum, u) => sum + u.count, 0);
    const eventLevelsClicked = new Set<number>();
    goldenButter.forEach(b => {
      if (b.level) eventLevelsClicked.add(b.level);
    });
    
    setAchievements(prev => prev.map(a => {
      if (a.unlocked) return a;
      let achieved = false;
      if (a.type === 'total' && totalButter >= a.requirement) achieved = true;
      if (a.type === 'click' && clicks >= a.requirement) achieved = true;
      if (a.type === 'building' && totalBuildings >= a.requirement) achieved = true;
      if (a.type === 'upgrade' && boughtUpgrades >= a.requirement) achieved = true;
      if (a.type === 'prestige' && prestige >= a.requirement) achieved = true;
      if (a.type === 'event' && eventClicks >= a.requirement) achieved = true;
      if (a.type === 'eventLevel' && a.requirement === 1) {
        // Spécifique pour le niveau 5
        const eventLevel5Clicked = localStorage.getItem('eventLevel5Clicked') === 'true';
        if (eventLevel5Clicked) achieved = true;
      }
      if (a.type === 'eventLevelAll' && eventLevelsClicked.size >= a.requirement) achieved = true;
      // Only notify when achievement is newly unlocked (and not already notified)
      if (achieved && !a.unlocked && !notifiedAchievements.current.has(a.id)) {
        notify(`${a.name}!`, a.emoji);
        notifiedAchievements.current.add(a.id);
      }
      return achieved ? { ...a, unlocked: true } : a;
    }));
  }, [totalButter, clicks, buildings, upgrades, prestige, eventClicks, notify]);

  // Load from localStorage on mount (immediately)
  useEffect(() => {
    const saved = localStorage.getItem('butterGameState');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setButter(data.butter || 0);
        setTotalButter(data.totalButter || 0);
        setClickPower(data.clickPower || 1);
        setClicks(data.clicks || 0);
        setMultiplier(data.multiplier || 1);
        setMultiplierTime(data.multiplierTime || 0);
        setPrestige(data.prestige || 0);
        setPrestigeBonus(data.prestigeBonus || 1);
        if (data.buildings) setBuildings(data.buildings);
        if (data.upgrades) setUpgrades(data.upgrades);
        if (data.achievements) setAchievements(data.achievements);
        console.log('✅ Progression chargée depuis localStorage');
      } catch (e) {
        console.error('Erreur localStorage:', e);
      }
    }
  }, []);

  // Load game progress from Firebase when user connects
  useEffect(() => {
    if (user) {
      loadGameProgress(user.uid).then(data => {
        if (data && Object.keys(data).length > 0) {
          console.log('🔥 Données reçues de Firebase:', {
            totalButter: data.totalButter,
            clickPower: data.clickPower,
            buildings: data.buildings?.reduce((sum: number, b: any) => sum + b.count, 0)
          });
          setButter(data.butter || 0);
          setTotalButter(data.totalButter || 0);
          setClickPower(data.clickPower || 1);
          setClicks(data.clicks || 0);
          setMultiplier(data.multiplier || 1);
          setMultiplierTime(data.multiplierTime || 0);
          setPrestige(data.prestige || 0);
          setPrestigeBonus(data.prestigeBonus || 1);
          setBuildings(data.buildings || buildings);
          setUpgrades(data.upgrades || upgrades);
          setAchievements(data.achievements || achievements);
          console.log('✅ Progression chargée depuis Firebase');
        } else {
          console.log('⚠️ Aucune donnée Firebase, utilisation du localStorage');
          const saved = localStorage.getItem('butterGameState');
          if (saved) {
            const data = JSON.parse(saved);
            setButter(data.butter || 0);
            setTotalButter(data.totalButter || 0);
            setClickPower(data.clickPower || 1);
            setClicks(data.clicks || 0);
            setMultiplier(data.multiplier || 1);
            setMultiplierTime(data.multiplierTime || 0);
            setPrestige(data.prestige || 0);
            setPrestigeBonus(data.prestigeBonus || 1);
            setBuildings(data.buildings || buildings);
            setUpgrades(data.upgrades || upgrades);
            setAchievements(data.achievements || achievements);
          }
        }
      }).catch((err) => {
        console.log('⚠️ Firebase indisponible, utilisation du localStorage', err);
        const saved = localStorage.getItem('butterGameState');
        if (saved) {
          const data = JSON.parse(saved);
          setButter(data.butter || 0);
          setTotalButter(data.totalButter || 0);
          setClickPower(data.clickPower || 1);
          setClicks(data.clicks || 0);
          setMultiplier(data.multiplier || 1);
          setMultiplierTime(data.multiplierTime || 0);
          setPrestige(data.prestige || 0);
          setPrestigeBonus(data.prestigeBonus || 1);
          setBuildings(data.buildings || buildings);
          setUpgrades(data.upgrades || upgrades);
          setAchievements(data.achievements || achievements);
        }
      });
    }
  }, [user]);

  // Test Firebase connection on component mount
  useEffect(() => {
    console.log('🔍 Firebase est initialisé et prêt');
  }, []);

  // Handle manual save
  const handleSaveProgress = useCallback(async () => {
    const gameState = {
      butter,
      totalButter,
      clickPower,
      clicks,
      multiplier,
      multiplierTime,
      prestige,
      prestigeBonus,
      buildings,
      upgrades,
      achievements,
    };
    
    console.log('💾 Tentative de sauvegarde avec:', {
      totalButter: gameState.totalButter,
      clickPower: gameState.clickPower,
      buildings: gameState.buildings.reduce((sum, b) => sum + b.count, 0)
    });
    
    try {
      localStorage.setItem('butterGameState', JSON.stringify(gameState));
      console.log('✅ Sauvegardé dans localStorage');
    } catch (e) {
      console.error('Erreur localStorage:', e);
    }
    
    // If user is not logged in, sign in first
    if (!user) {
      try {
        console.log('📱 Tentative de connexion Google...');
        await signIn();
        // After sign in, user should be set by the auth state
        notify('✅ Connexion réussie! Sauvegarde en cours...', '✨');
      } catch (err) {
        console.error('Erreur connexion:', err);
        notify('❌ Connexion échouée', '⚠️');
      }
    } else {
      // User is logged in, just save
      try {
        console.log('🔥 Sauvegarde sur Firebase pour:', user.uid);
        await saveGameProgress(user.uid, gameState);
        console.log('✅ Sauvegardé sur Firebase');
        notify('✅ Sauvegarde réussie!', '💾');
      } catch (err) {
        console.error('Erreur Firebase:', err);
        notify('❌ Erreur sauvegarde', '⚠️');
      }
    }
  }, [user, butter, totalButter, clickPower, clicks, multiplier, multiplierTime, prestige, prestigeBonus, buildings, upgrades, achievements, signIn, notify]);

  // Save game progress periodically
  useEffect(() => {
    const saveToStorage = () => {
      const gameState = {
        butter,
        totalButter,
        clickPower,
        clicks,
        multiplier,
        multiplierTime,
        prestige,
        prestigeBonus,
        buildings,
        upgrades,
        achievements,
      };
      
      try {
        localStorage.setItem('butterGameState', JSON.stringify(gameState));
      } catch (e) {
        console.error('Erreur localStorage:', e);
      }
      
      if (user) {
        saveGameProgress(user.uid, gameState).catch(err => {
          console.error('Erreur Firebase:', err);
        });
      }
    };
    
    // Sauvegarder immédiatement
    saveToStorage();
    
    // Et toutes les 3 secondes
    const interval = setInterval(saveToStorage, 3000);
    return () => clearInterval(interval);
  }, [user, butter, totalButter, clickPower, clicks, multiplier, multiplierTime, prestige, prestigeBonus, buildings, upgrades, achievements]);

  // Handlers
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const value = clickPower * multiplier;
    setButter(b => b + value);
    setTotalButter(t => t + value);
    setClicks(c => c + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const id = Date.now() + Math.random();
    setShowFloat(prev => [...prev, { id, text: `+${fmt(value)}`, x, y, isClick: true }]);
    setTimeout(() => setShowFloat(prev => prev.filter(f => f.id !== id)), 1000);
  };

  const buyBuilding = (index: number) => {
    if (butter >= buildings[index].cost) {
      const b = buildings[index];
      setButter(prev => prev - b.cost);
      const newBuildings = [...buildings];
      newBuildings[index] = {
        ...b,
        count: b.count + 1,
        cost: Math.floor(b.baseCost * Math.pow(1.15, b.count + 1))
      };
      setBuildings(newBuildings);
    }
  };

  const buyUpgrade = (index: number) => {
    const u = upgrades[index];
    if (butter >= u.cost && totalButter >= u.requirement) {
      setButter(prev => prev - u.cost);
      setClickPower(prev => prev + u.clickBonus);
      const newUpgrades = [...upgrades];
      newUpgrades[index] = {
        ...u,
        count: u.count + 1,
        cost: Math.floor(u.baseCost * Math.pow(1.15, u.count + 1))
      };
      setUpgrades(newUpgrades);
      notify(`${u.name} x${u.count + 1}!`, u.icon);
    }
  };

  const handleGoldenClick = (butterEvent: any) => {
    const bonus = butterEvent.reward || 10;
    setButter(b => b + bonus);
    setTotalButter(t => t + bonus);
    setEventClicks(e => e + 1);
    
    // Track level 5 events
    if (butterEvent.level === 5) {
      localStorage.setItem('eventLevel5Clicked', 'true');
    }
    
    // Multiplicateur basé sur le niveau de l'événement et la progression
    const baseMultipliers = [2, 4, 7, 10, 15]; // Par niveau d'événement
    const eventMultiplier = baseMultipliers[butterEvent.level - 1] * prestigeBonus;
    
    setMultiplier(eventMultiplier);
    setMultiplierTime(10);
    setGoldenButter(prev => prev.filter(b => b.id !== butterEvent.id));
    const levelText = butterEvent.level > 1 ? ` 🎁 Event Lvl ${butterEvent.level}` : '';
    notify(`✨ +${fmt(bonus)} | x${Math.floor(eventMultiplier)}${levelText}`, '🧈');
  };

  const handlePrestige = () => {
    if (totalButter >= 1000000) {
      const prestigeGain = Math.floor(Math.sqrt(totalButter / 1000000));
      setPrestige(prev => prev + prestigeGain);
      setPrestigeBonus(prev => prev + (prestigeGain * 0.01));
      
      // Reset game
      setButter(0);
      setClickPower(1);
      setClicks(0);
      setMultiplier(1);
      setMultiplierTime(0);
      setBuildings(buildings.map(b => ({ ...b, count: 0, cost: b.baseCost })));
      setUpgrades(upgrades.map(u => ({ ...u, count: 0, cost: u.baseCost })));
      
      notify(`+${prestigeGain} Prestige!`, '👑');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-amber-900 flex items-center justify-center text-white text-2xl">Chargement...</div>;
  }

  const totalBuildings = buildings.reduce((sum, b) => sum + b.count, 0);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 to-cyan-900 p-4" style={{backgroundAttachment: 'fixed'}}>
      {/* Stats - Fixed top-left */}
      <div className="fixed top-4 left-4 z-40 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-700/90 backdrop-blur px-2 py-1 rounded text-xs border-l-2 border-cyan-400"><p className="font-black text-white text-sm">{fmt(totalButter)}</p><p className="text-xs text-gray-300">Total</p></div>
          <div className="bg-gray-700/90 backdrop-blur px-2 py-1 rounded text-xs border-l-2 border-cyan-400"><p className="font-black text-white text-sm">{fmt(bps)}</p><p className="text-xs text-gray-300">/sec</p></div>
          <div className="bg-gray-700/90 backdrop-blur px-2 py-1 rounded text-xs border-l-2 border-cyan-400"><p className="font-black text-white text-sm">{clicks}</p><p className="text-xs text-gray-300">Clics</p></div>
          <div className="bg-gray-700/90 backdrop-blur px-2 py-1 rounded text-xs border-l-2 border-cyan-400"><p className="font-black text-white text-sm">+{clickPower}</p><p className="text-xs text-gray-300">/clic</p></div>
        </div>
      </div>

      {/* Auth */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button 
                onClick={handleSaveProgress}
                className="px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-full hover:from-green-500 hover:to-emerald-500 transition-all hover:scale-105 shadow-lg"
              >
                💾 Sauvegarder
              </button>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                <span className="text-white text-sm font-bold">{user.displayName}</span>
                <button onClick={logOut} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">X</button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => {
                signIn().catch(err => {
                  console.error('Erreur connexion:', err);
                  notify('❌ Connexion échouée', '⚠️');
                });
              }}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 transition-all hover:scale-105 shadow-lg"
            >
              🔐 Google
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto outline-none ring-0">
        <h1 className="text-7xl font-black text-white text-center mb-2 drop-shadow-lg" style={{textShadow: '0 4px 20px rgba(251, 191, 36, 0.4)'}}>🧈 BUTTER EMPIRE 🧈</h1>
        <p className="text-center text-yellow-200 font-bold text-lg mb-8 drop-shadow">Le jeu de cliquer ultime</p>
        
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          <div className="bg-gray-700/80 backdrop-blur border border-cyan-400 px-4 py-2 rounded-xl font-bold text-cyan-300 shadow-lg hover:bg-gray-700 transition">📊 Niv. {level}</div>
          <div className="bg-gray-700/80 backdrop-blur border border-cyan-400 px-4 py-2 rounded-xl font-bold text-cyan-300 shadow-lg hover:bg-gray-700 transition">🏢 {totalBuildings}</div>
          <div className="bg-gray-700/80 backdrop-blur border border-cyan-400 px-4 py-2 rounded-xl font-bold text-cyan-300 shadow-lg hover:bg-gray-700 transition">🎁 8/25</div>
          <div className="bg-gray-700/80 backdrop-blur border border-cyan-400 px-4 py-2 rounded-xl font-bold text-cyan-300 shadow-lg hover:bg-gray-700 transition">📚 {totalBuildings}</div>
          <div className="bg-gray-700/80 backdrop-blur border border-cyan-400 px-4 py-2 rounded-xl font-bold text-cyan-300 shadow-lg hover:bg-gray-700 transition">🏆 {unlockedAchievements}/{achievements.length}</div>
          <div className="bg-gray-700/80 backdrop-blur border border-cyan-400 px-4 py-2 rounded-xl font-bold text-cyan-300 shadow-lg hover:bg-gray-700 transition">👑 {prestige}</div>
          <div className="bg-gray-700/80 backdrop-blur border border-cyan-400 px-4 py-2 rounded-xl font-bold text-cyan-300 shadow-lg hover:bg-gray-700 transition">⚡ x{prestigeBonus.toFixed(2)}</div>
          <button onClick={handlePrestige} disabled={totalButter < 1000000} className={`px-6 py-2 rounded-xl font-black transition ${totalButter >= 1000000 ? 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg border border-cyan-400' : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'}`}>
            💫 Prestige
          </button>
        </div>

        {/* Main Button Section - Central */}
        <div className="flex flex-col items-center justify-center gap-8 mb-12 outline-none ring-0">
          {/* Current Butter Display */}
          <div className="text-center">
            <p className="text-7xl font-black text-white drop-shadow" style={{textShadow: '0 2px 8px rgba(0,0,0,0.5)'}}>{fmt(butter)}</p>
            <p className="text-xl font-bold text-gray-300">🧈 Beurres</p>
          </div>

          {/* Main Butter Button */}
          <button
            onClick={handleClick}
            className="transition-all duration-200 active:scale-95 hover:scale-115 bg-transparent border-none cursor-pointer flex items-center justify-center"
            style={{ fontSize: '280px', lineHeight: '1', width: '300px', height: '300px' }}
          >
            🧈
          </button>

          {/* Click Power Display */}
          <div className="text-center">
            <p className="text-3xl font-black text-white drop-shadow">+{fmt(clickPower * multiplier)}</p>
            <p className="text-xl text-yellow-100 font-bold drop-shadow">par clic</p>
            {multiplier > 1 && (
              <div className="mt-4 px-6 py-3 bg-gray-700 rounded-full inline-block border-2 border-cyan-400 shadow-lg">
                <p className="text-white font-black text-lg animate-pulse drop-shadow">⚡ Multiplicateur x{multiplier} !</p>
                <p className="text-cyan-300 font-bold text-sm drop-shadow">{multiplierTime}s restants</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats and Content */}
        <div className="space-y-6 mt-12 outline-none ring-0">
          {/* Shop and Upgrades Side by Side */}
          <div className="grid grid-cols-2 gap-6">
            {/* Shop */}
            <div>
              <h2 className="text-3xl font-black text-white mb-4">🏪 BOUTIQUE</h2>
              <div className="grid grid-cols-1 gap-1 max-h-[380px] overflow-y-auto">
                {buildings.map((b, i) => {
                  // Afficher les 5 premiers ou ceux dont le prédécesseur a au moins 1 exemplaire
                  const isVisible = i < 5 || (i > 0 && buildings[i - 1].count > 0);
                  if (!isVisible) return null;
                  
                  return (
                  <button
                    key={b.name}
                    onClick={() => buyBuilding(i)}
                    disabled={butter < b.cost}
                    className={`p-2 rounded-xl text-left font-bold transition-all duration-200 ${butter >= b.cost ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500 shadow-lg hover:shadow-cyan-400/30 border-2 border-cyan-400 hover:border-cyan-300 scale-100 hover:scale-105' : 'bg-gray-800 text-gray-500 opacity-40 cursor-not-allowed'}`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-2xl">{b.emoji}</span>
                      <div className="flex-1">
                        <p className="font-black text-xs text-white">{b.name}</p>
                        <p className="text-xs text-cyan-300 font-semibold">x{b.count}</p>
                      </div>
                    </div>
                    <div className="border-t border-gray-500/30 pt-0.5">
                      <p className="text-xs text-yellow-300 font-bold">{fmt(b.cost)}</p>
                      <p className="text-xs text-cyan-400/80">{fmt(b.bps)}/s</p>
                    </div>
                  </button>
                );
                })}
              </div>
            </div>

            {/* Upgrades */}
            <div>
              <h2 className="text-3xl font-black text-white mb-4">⚡ Améliorations</h2>
              <div className="grid grid-cols-1 gap-1 max-h-[380px] overflow-y-auto">
                {upgrades.map((u, i) => {
                  // Afficher les 5 premières ou celles dont la prédécesseur a au moins 1 exemplaire
                  const isVisible = i < 5 || (i > 0 && upgrades[i - 1].count > 0);
                  if (!isVisible) return null;
                  
                  return (
                  <button
                    key={u.id}
                    onClick={() => buyUpgrade(i)}
                    disabled={butter < u.cost || totalButter < u.requirement}
                    className={`p-2 rounded-xl text-left font-bold transition-all duration-200 ${
                        u.count > 0 ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/50 border-2 border-cyan-300 hover:from-cyan-500 hover:to-cyan-400 scale-100 hover:scale-105' 
                        : butter >= u.cost && totalButter >= u.requirement ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:from-gray-600 hover:to-gray-500 shadow-lg hover:shadow-cyan-400/30 border-2 border-cyan-400 hover:border-cyan-300 scale-100 hover:scale-105' 
                      : 'bg-gray-800 text-gray-500 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-2xl">{u.icon}</span>
                      <div className="flex-1">
                        <p className="font-black text-xs text-white">{u.name}</p>
                        <p className="text-xs text-yellow-300 font-semibold">{fmt(u.cost)}</p>
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-0.5">
                      <p className="text-xs text-yellow-300 font-bold">+{fmt(u.clickBonus)}/clic</p>
                      {u.count > 0 && <p className="text-xs text-white/70">x{u.count}</p>}
                    </div>
                  </button>
                );
                })}
              </div>
            </div>
          </div>

          {/* Achievements Button */}
          <button 
            onClick={() => setShowAchievements(true)}
            className="bg-gray-700/80 backdrop-blur border border-cyan-400 px-6 py-3 rounded-xl font-black text-cyan-300 shadow-lg hover:bg-gray-700 transition text-lg"
          >
            🏆 Succès ({unlockedAchievements}/{achievements.length})
          </button>
        </div>

        {/* Achievements Modal */}
        {showAchievements && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-2xl p-6 border border-cyan-400 shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-white">🏆 Succès</h2>
                <button 
                  onClick={() => setShowAchievements(false)}
                  className="text-gray-400 hover:text-white text-3xl transition"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-5 gap-3 relative">
                {achievements.map(a => {
                  let howToGet = '';
                  if (a.type === 'click') howToGet = `Faire ${fmt(a.requirement)} clics`;
                  else if (a.type === 'total') howToGet = `Obtenir ${fmt(a.requirement)} beurres`;
                  else if (a.type === 'building') howToGet = `Posséder ${a.requirement} bâtiment${a.requirement > 1 ? 's' : ''}`;
                  else if (a.type === 'upgrade') howToGet = `Acheter ${a.requirement} amélioration${a.requirement > 1 ? 's' : ''}`;
                  else if (a.type === 'prestige') howToGet = `Faire ${a.requirement} prestige${a.requirement > 1 ? 's' : ''}`;
                  
                  return (
                  <div
                    key={a.id}
                      className={`p-4 rounded-lg text-center transition cursor-help group relative ${a.unlocked ? 'bg-cyan-600 shadow-lg border border-cyan-400' : 'bg-gray-700 opacity-50'}`}
                  >
                    <div className="text-4xl mb-2">{a.emoji}</div>
                    <div className={`text-sm font-black ${a.unlocked ? 'text-amber-900' : 'text-gray-400'}`}>{a.name}</div>
                    
                    {/* Tooltip */}
                    <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 px-4 py-3 bg-black text-white text-sm rounded-lg pointer-events-none opacity-0 group-hover:!opacity-100 transition duration-200 z-[9999] border-2 border-cyan-400 shadow-2xl whitespace-normal w-56">
                      <p className="font-black mb-2 text-cyan-300">{a.name}</p>
                      <p className="text-gray-100 mb-2">{a.desc}</p>
                      <p className="text-cyan-400 text-xs italic">➜ {howToGet}</p>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>
          </div>
        )}
        {/* Falling butters */}
        {goldenButter.map(butter => (
          <div
            key={butter.id}
            onClick={() => handleGoldenClick(butter)}
            className="fixed text-7xl cursor-pointer hover:scale-125 z-50 animate-fall"
            style={{ 
              left: `${butter.x}%`, 
              top: `${butter.y}px`,
              filter: `drop-shadow(0 0 40px ${butter.colorHex}) drop-shadow(0 0 20px ${butter.colorHex})`,
              background: 'none',
              border: 'none',
              padding: '0',
              color: butter.colorHex
            }}
          >
            {butter.color}
          </div>
        ))}

        {/* Notifications */}
        <div className="fixed top-24 right-4 space-y-2 z-40 pointer-events-none">
          {showFloat.filter(f => !f.isClick).map(n => (
            <div key={n.id} className="bg-gray-800 text-white px-4 py-3 rounded-xl font-bold flex items-center gap-3 shadow-xl border-l-4 border-cyan-400 animate-slide-in-right">
              <span className="text-2xl">{n.emoji}</span>
              <span className="text-sm">{n.text}</span>
            </div>
          ))}
        </div>

        {/* Float animations */}
        {showFloat.filter(f => f.isClick).map(f => (
          <span
            key={f.id}
            className="fixed text-5xl font-black text-cyan-300 pointer-events-none animate-float-up"
            style={{ left: `${f.x}%`, top: `${f.y}%`, textShadow: '0 0 20px rgba(34, 211, 238, 0.8)' }}
          >
            {f.text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce { animation: bounce 1s infinite; }
        
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right { animation: slide-in-right 0.4s ease-out; }
        
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px);
          }
        }
        .animate-float-up { animation: float-up 1.5s ease-out forwards; }
        
        @keyframes fall {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 1;
            transform: translateY(100vh);
          }
        }
        .animate-fall { animation: fall 5s linear forwards; }
      `}</style>
    </div>
  );
}
