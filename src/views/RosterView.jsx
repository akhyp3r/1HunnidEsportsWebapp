import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Key, 
  Trash2, 
  Edit2, 
  Copy, 
  Check, 
  Shield, 
  Sparkles, 
  ExternalLink, 
  Eye, 
  EyeOff,
  UserCheck,
  RefreshCw,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function RosterView({ 
  players, 
  onCreatePlayer, 
  onDeletePlayer, 
  onUpdatePlayer,
  isModalOpen,
  setIsModalOpen
}) {
  const { user, isManager } = useAuth();
  const [copiedId, setCopiedId] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [selectedPlayerToEdit, setSelectedPlayerToEdit] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    ign: '',
    gameRole: 'Entry / Duelist',
    discord: '',
    bio: '',
    role: 'player'
  });

  const generateRandomPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789!@#$';
    let pass = 'apex_';
    for (let i = 0; i < 4; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setFormData(prev => ({ ...prev, password: pass }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.ign) return;
    await onCreatePlayer(formData);
    setIsModalOpen(false);
    setFormData({
      username: '',
      password: '',
      name: '',
      ign: '',
      gameRole: 'Entry / Duelist',
      discord: '',
      bio: '',
      role: 'player'
    });
  };

  const copyCredentials = (player) => {
    const text = `🎮 **APEX ESPORTS - PLAYER LOGIN CREDENTIALS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Player: ${player.name} (${player.ign})
Role: ${player.gameRole}
Username: ${player.username}
Password: ${player.plainPasswordPreview || '[Contact Manager]'}
Team Hub: ${window.location.origin}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 *Log into your account to submit your weekly free times and RSVP for today's scrim!*`;

    navigator.clipboard.writeText(text);
    setCopiedId(player.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Users className="w-4 h-4" />
            <span>Roster & Access Management</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Team Players & Login Credentials
          </h2>
          <p className="text-xs text-[#8e918f] mt-0.5">
            {isManager 
              ? "Create login accounts for your players, share credentials, or remove players." 
              : "Active teammates on the official roster."}
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => {
              generateRandomPassword();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Create Player Login ID</span>
          </button>
        )}
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {players.map((player) => {
          const isMe = player.id === user?.id;
          const isPlayerManager = player.role === 'manager';

          return (
            <div
              key={player.id}
              className={`p-6 rounded-3xl bg-[#1e1f20] border transition-all flex flex-col justify-between ${
                isMe
                  ? 'border-red-500/50 shadow-gemini-glow'
                  : 'border-[#333538] hover:border-[#474a4d]'
              }`}
            >
              <div>
                {/* Top card row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={player.avatar || '/assets/logo.png'}
                      alt={player.ign}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#44474a]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold text-white truncate max-w-[140px]">
                          {player.ign}
                        </h3>
                        {isMe && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8e918f]">{player.name}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    isPlayerManager
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {player.gameRole || player.role}
                  </span>
                </div>

                {/* Bio / Info */}
                <p className="text-xs text-[#c4c7c5] mt-3.5 leading-relaxed line-clamp-2">
                  {player.bio || 'Apex Esports Active Player'}
                </p>

                {player.discord && (
                  <div className="mt-2.5 text-xs text-[#8e918f] flex items-center gap-1.5">
                    <span className="text-indigo-400 font-medium">Discord:</span>
                    <span className="text-zinc-300 font-mono text-[11px]">{player.discord}</span>
                  </div>
                )}

                {/* LOGIN CREDENTIALS SECTION (Only visible to Manager) */}
                {isManager && (
                  <div className="mt-4 p-3.5 rounded-2xl bg-[#131314] border border-[#333538]">
                    <div className="flex items-center justify-between text-[11px] text-[#8e918f] mb-1.5">
                      <span className="flex items-center gap-1 font-semibold text-zinc-300">
                        <Key className="w-3 h-3 text-red-400" />
                        Login Credentials
                      </span>
                      <button
                        onClick={() => togglePasswordVisibility(player.id)}
                        className="text-[#8e918f] hover:text-white flex items-center gap-1"
                      >
                        {showPasswords[player.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPasswords[player.id] ? 'Hide' : 'Reveal'}</span>
                      </button>
                    </div>

                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Username:</span>
                        <span className="text-white font-bold">{player.username}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Password:</span>
                        <span className="text-red-300 font-bold">
                          {showPasswords[player.id]
                            ? player.plainPasswordPreview || '••••••••'
                            : '••••••••'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#333538]/50 flex items-center justify-between">
                      <button
                        onClick={() => copyCredentials(player)}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-red-400 hover:text-red-300"
                      >
                        {copiedId === player.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === player.id ? 'Copied to Clipboard!' : 'Copy Credentials for Player'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions for Manager */}
              {isManager && !isPlayerManager && (
                <div className="mt-4 pt-3 border-t border-[#333538]/60 flex items-center justify-between">
                  <span className="text-[10px] text-[#8e918f]">
                    ID: {player.id.slice(0, 10)}
                  </span>

                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to remove ${player.ign} from the team?`)) {
                        onDeletePlayer(player.id);
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium px-2 py-1 rounded-lg hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Player</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CREATE PLAYER LOGIN ID MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#1e1f20] border border-[#333538] p-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#333538]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Create Player Login ID</h3>
                  <p className="text-xs text-[#8e918f]">Make credentials and account for a new teammate</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-[#282a2c] text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    In-Game Name (IGN) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Valkyrie, TenZ"
                    value={formData.ign}
                    onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Real Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Login Credentials Box */}
              <div className="p-4 rounded-2xl bg-[#131314] border border-emerald-500/30 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Key className="w-3.5 h-3.5" />
                  <span>Login Credentials Setup</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#8e918f] mb-1">
                      Login Username ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. valk"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-[#1e1f20] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-[#8e918f]">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-[#1e1f20] border border-[#333538] rounded-xl px-3 py-2 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Team Role
                  </label>
                  <select
                    value={formData.gameRole}
                    onChange={(e) => setFormData({ ...formData, gameRole: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="IGL / Initiator">IGL / Initiator</option>
                    <option value="Entry / Duelist">Entry / Duelist</option>
                    <option value="Anchor / Controller">Anchor / Controller</option>
                    <option value="Sniper / Operator">Sniper / Operator</option>
                    <option value="Flex / Sentinel">Flex / Sentinel</option>
                    <option value="Sub / Sixth Man">Sub / Sixth Man</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Discord Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. player#1337"
                    value={formData.discord}
                    onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                  Bio / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Player background or goals"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#333538]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs text-[#8e918f] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-bold shadow-sm transition-all"
                >
                  Create & Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
