import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Key, 
  Trash2, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  X,
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminRosterView({
  players,
  onCreatePlayer,
  onDeletePlayer,
  isModalOpen,
  setIsModalOpen
}) {
  const { user } = useAuth();
  const [copiedId, setCopiedId] = useState(null);
  const [showPasswords, setShowPasswords] = useState({});
  const [playerToDelete, setPlayerToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    let pass = '100_';
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
    const text = `🎮 **ONE HUNNID ESPORTS - PLAYER CREDENTIALS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IGN: ${player.ign}
Real Name: ${player.name}
Role: ${player.gameRole}
Username ID: ${player.username}
Password: ${player.plainPasswordPreview || '[Contact Manager]'}
Portal URL: ${window.location.origin}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👉 *Log in to submit your daily free times and RSVP for today's scrim!*`;

    navigator.clipboard.writeText(text);
    setCopiedId(player.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const togglePassword = (id) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const registeredPlayers = players.filter(p => p.role === 'player');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
            Roster & Access
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
            Player Accounts & Login Credentials
          </h2>
          <p className="text-xs text-[#9a9c9e] mt-0.5">
            Create login accounts for your players and copy credentials to send them.
          </p>
        </div>

        <button
          onClick={() => {
            generateRandomPassword();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Create Player Login</span>
        </button>
      </div>

      {/* Players List */}
      {registeredPlayers.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#1c1d1e] border border-dashed border-[#2e3032] text-center">
          <Users className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No Players on Roster</h3>
          <p className="text-xs text-[#9a9c9e] max-w-sm mx-auto mt-1">
            Click "+ Create Player Login" above to generate credentials for your first player.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {registeredPlayers.map((player) => (
            <div
              key={player.id}
              className="p-5 rounded-3xl bg-[#1c1d1e] border border-[#2e3032] hover:border-[#3e4043] transition-colors flex flex-col justify-between"
            >
              <div>
                {/* Top card row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={player.avatar || '/assets/logo.png'}
                      alt={player.ign}
                      className="w-11 h-11 rounded-2xl object-cover border border-[#2f3133]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{player.ign}</h4>
                      <p className="text-xs text-[#9a9c9e]">{player.name}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#262729] text-zinc-300 border border-[#2e3032]">
                    {player.gameRole}
                  </span>
                </div>

                {player.discord && (
                  <div className="mt-2.5 text-xs text-[#9a9c9e]">
                    Discord: <span className="text-zinc-300 font-mono text-[11px]">{player.discord}</span>
                  </div>
                )}

                {/* Login Credentials Box */}
                <div className="mt-3.5 p-3 rounded-2xl bg-[#131314] border border-[#262729]">
                  <div className="flex items-center justify-between text-[11px] text-[#9a9c9e] mb-1.5">
                    <span className="font-semibold text-zinc-400 flex items-center gap-1">
                      <Key className="w-3 h-3 text-red-400" />
                      Login Credentials
                    </span>
                    <button
                      onClick={() => togglePassword(player.id)}
                      className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[10px]"
                    >
                      {showPasswords[player.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPasswords[player.id] ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>

                  <div className="text-xs font-mono space-y-1">
                    <div className="flex justify-between">
                      <span className="text-zinc-600">Username:</span>
                      <span className="text-white font-bold">{player.username}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-600">Password:</span>
                      <span className="text-red-300 font-bold">
                        {showPasswords[player.id]
                          ? player.plainPasswordPreview || '••••••••'
                          : '••••••••'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => copyCredentials(player)}
                    className="mt-2.5 pt-2 border-t border-[#202123] w-full text-left flex items-center gap-1.5 text-[11px] font-semibold text-red-400 hover:text-red-300 transition-colors"
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

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-[#262729] flex items-center justify-between">
                <span className="text-[10px] text-zinc-600 font-mono">
                  ID: {player.id.slice(0, 10)}
                </span>
                <button
                  type="button"
                  onClick={() => setPlayerToDelete(player)}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Player</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE PLAYER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#1c1d1e] border border-[#2e3032] p-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2e3032]">
              <div>
                <h3 className="text-base font-bold text-white">Create Player Login ID</h3>
                <p className="text-xs text-[#9a9c9e]">Generate credentials and account for a new teammate</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-zinc-500 hover:text-white">
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
                    placeholder="e.g. Ace, Reaper"
                    value={formData.ign}
                    onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                    className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Real Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
                  />
                </div>
              </div>

              {/* Login Credentials Box */}
              <div className="p-4 rounded-2xl bg-[#131314] border border-[#2f3133] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300">
                  <Key className="w-3.5 h-3.5 text-red-400" />
                  <span>Login Credentials Setup</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-[#9a9c9e] mb-1">
                      Username ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. player1"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full bg-[#1c1d1e] border border-[#2e3032] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500/60"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-[#9a9c9e]">
                        Password *
                      </label>
                      <button
                        type="button"
                        onClick={generateRandomPassword}
                        className="text-[10px] text-red-400 hover:underline"
                      >
                        Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-[#1c1d1e] border border-[#2e3032] rounded-xl px-3 py-2 text-xs text-red-300 font-mono focus:outline-none focus:border-red-500/60"
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
                    className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
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
                    placeholder="e.g. tag#0001"
                    value={formData.discord}
                    onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                    className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                  Bio / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Player background or notes"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2e3032]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Create & Save Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM PLAYER REMOVAL MODAL */}
      {playerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[#1c1d1e] border border-[#2e3032] p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-white">
              Remove {playerToDelete.ign}?
            </h3>
            <p className="text-xs text-[#9a9c9e] mt-1.5 leading-relaxed">
              Are you sure you want to remove <strong className="text-white">{playerToDelete.name}</strong> from One Hunnid Esports? Their login ID and account credentials will be permanently removed.
            </p>

            <div className="flex items-center justify-center gap-2.5 mt-6">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setPlayerToDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-full bg-[#262729] hover:bg-[#313235] text-xs font-semibold text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  try {
                    setIsDeleting(true);
                    await onDeletePlayer(playerToDelete.id);
                  } finally {
                    setIsDeleting(false);
                    setPlayerToDelete(null);
                  }
                }}
                className="flex-1 px-4 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-sm"
              >
                {isDeleting ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
