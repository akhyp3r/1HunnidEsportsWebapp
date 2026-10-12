import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import AdminLayout from './layouts/AdminLayout';
import PlayerLayout from './layouts/PlayerLayout';
import LoginView from './views/LoginView';

export default function App() {
  const { user, loading: authLoading, isManager } = useAuth();

  const [scrims, setScrims] = useState([]);
  const [players, setPlayers] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({ matrix: [], mySchedule: [], daysOfWeek: [] });
  const [announcements, setAnnouncements] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [soundEnabled, setSoundEnabled] = useState(true);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio playback restrictions
    }
  };

  const loadData = async () => {
    if (!user) return;
    try {
      setLoadingData(true);
      const [scrimsRes, playersRes, availRes, annRes] = await Promise.all([
        api.getScrims(),
        api.getPlayers(),
        api.getAvailability(),
        api.getAnnouncements()
      ]);

      setScrims(scrimsRes.scrims || []);
      setPlayers(playersRes.players || []);
      setAvailabilityData(availRes || { matrix: [], mySchedule: [] });
      setAnnouncements(annRes.announcements || []);

      const hasToday = scrimsRes.scrims?.find(s => s.isToday && s.status === 'upcoming');
      if (hasToday) {
        playChime();
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  // Scrim RSVP
  const handleRsvp = async (scrimId, status, note) => {
    await api.rsvpScrim(scrimId, status, note);
    const data = await api.getScrims();
    setScrims(data.scrims || []);
  };

  // Scrim Creator (Admin)
  const handleCreateScrim = async (scrimData) => {
    await api.createScrim(scrimData);
    await loadData();
    playChime();
  };

  const handleDeleteScrim = async (scrimId) => {
    await api.deleteScrim(scrimId);
    setScrims(prev => prev.filter(s => s.id !== scrimId));
  };

  // Availability Update (Player or Admin)
  const handleUpdateAvailability = async (entries) => {
    await api.updateAvailability(entries);
    const updated = await api.getAvailability();
    setAvailabilityData(updated);
  };

  // Player Account Creation & Deletion (Admin)
  const handleCreatePlayer = async (playerData) => {
    await api.createPlayer(playerData);
    const res = await api.getPlayers();
    setPlayers(res.players || []);
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      // Optimistic update
      setPlayers(prev => prev.filter(p => p.id !== playerId));
      await api.deletePlayer(playerId);
      const [res, availRes, scrimsRes] = await Promise.all([
        api.getPlayers(),
        api.getAvailability(),
        api.getScrims()
      ]);
      setPlayers(res.players || []);
      setAvailabilityData(availRes || { matrix: [], mySchedule: [] });
      setScrims(scrimsRes.scrims || []);
    } catch (err) {
      console.error('Failed to remove player:', err);
      // Reload on error
      const res = await api.getPlayers();
      setPlayers(res.players || []);
    }
  };

  // Announcements (Admin)
  const handleCreateAnnouncement = async (annData) => {
    await api.createAnnouncement(annData);
    const res = await api.getAnnouncements();
    setAnnouncements(res.announcements || []);
  };

  const handleDeleteAnnouncement = async (annId) => {
    await api.deleteAnnouncement(annId);
    setAnnouncements(prev => prev.filter(a => a.id !== annId));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#131314] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain animate-pulse" />
          <span className="text-[11px] text-zinc-500 font-mono">One Hunnid Esports...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  // DISTINCT INTERFACES BASED ON ROLE
  if (isManager) {
    return (
      <AdminLayout
        scrims={scrims}
        players={players}
        availabilityData={availabilityData}
        announcements={announcements}
        onCreateScrim={handleCreateScrim}
        onDeleteScrim={handleDeleteScrim}
        onCreatePlayer={handleCreatePlayer}
        onDeletePlayer={handleDeletePlayer}
        onCreateAnnouncement={handleCreateAnnouncement}
        onDeleteAnnouncement={handleDeleteAnnouncement}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />
    );
  }

  // PLAYER INTERFACE (Cannot access admin dashboard)
  return (
    <PlayerLayout
      scrims={scrims}
      availabilityData={availabilityData}
      announcements={announcements}
      onRsvp={handleRsvp}
      onUpdateAvailability={handleUpdateAvailability}
    />
  );
}
