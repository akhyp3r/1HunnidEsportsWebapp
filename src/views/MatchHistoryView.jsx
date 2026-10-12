import React, { useState } from 'react';
import { 
  Trophy, 
  Plus, 
  ExternalLink, 
  Video, 
  Award, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MatchHistoryView({ matches, onCreateMatch }) {
  const { isManager } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    opponent: '',
    scrimDate: new Date().toISOString().split('T')[0],
    format: 'Best of 3 (Bo3)',
    result: 'win',
    score: '2 - 1',
    vodLink: '',
    mvp: '',
    coachNotes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreateMatch(formData);
    setIsModalOpen(false);
    setFormData({
      opponent: '',
      scrimDate: new Date().toISOString().split('T')[0],
      format: 'Best of 3 (Bo3)',
      result: 'win',
      score: '2 - 1',
      vodLink: '',
      mvp: '',
      coachNotes: ''
    });
  };

  const winCount = matches.filter(m => m.result === 'win').length;
  const totalMatches = matches.length;
  const winRate = totalMatches > 0 ? Math.round((winCount / totalMatches) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
            <Trophy className="w-4 h-4" />
            <span>Competitive Performance</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Scrim Match History & VOD Reviews
          </h2>
          <p className="text-xs text-[#8e918f] mt-0.5">
            Track scrim outcomes, match vods, coach analysis, and MVPs.
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Record Scrim Result</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#1e1f20] border border-[#333538]">
          <div className="text-xs text-[#8e918f]">Total Scrims Recorded</div>
          <div className="text-2xl font-extrabold text-white mt-1 font-mono">{totalMatches} Scrims</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1e1f20] border border-[#333538]">
          <div className="text-xs text-[#8e918f]">Win Rate</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono">{winRate}% ({winCount}W - {totalMatches - winCount}L)</div>
        </div>

        <div className="p-5 rounded-3xl bg-[#1e1f20] border border-[#333538]">
          <div className="text-xs text-[#8e918f]">Performance Tier</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1 flex items-center gap-2">
            <span>Challenger</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Match Cards */}
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="p-6 rounded-3xl bg-[#1e1f20] border border-[#333538] hover:border-[#474a4d] transition-all"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#333538]/60">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  match.result === 'win'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40'
                    : 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                }`}>
                  {match.result === 'win' ? 'VICTORY' : 'DEFEAT'}
                </span>
                <h3 className="text-base font-bold text-white">vs {match.opponent}</h3>
                <span className="text-xs text-[#8e918f]">({match.format})</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg font-black font-mono text-white tracking-widest px-3 py-1 rounded-xl bg-[#131314] border border-[#333538]">
                  {match.score}
                </span>
                <span className="text-xs text-[#8e918f] font-mono">{match.scrimDate}</span>
              </div>
            </div>

            {/* Coach & MVP notes */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {match.coachNotes && (
                <div className="p-3 rounded-2xl bg-[#131314] border border-[#333538]/50 text-xs text-[#c4c7c5]">
                  <span className="font-semibold text-white mr-1">Coach Breakdown:</span>
                  {match.coachNotes}
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3">
                {match.mvp && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>MVP: {match.mvp}</span>
                  </div>
                )}

                {match.vodLink && (
                  <a
                    href={match.vodLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#282a2c] hover:bg-[#37393b] text-white text-xs font-medium border border-[#333538] transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-red-400" />
                    <span>Watch Match VOD</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RECORD MATCH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#1e1f20] border border-[#333538] p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-[#333538]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Record Scrim Result</h3>
                  <p className="text-xs text-[#8e918f]">Archive match scores, coach feedback, and MVP</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Opponent</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sentinels"
                    value={formData.opponent}
                    onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.scrimDate}
                    onChange={(e) => setFormData({ ...formData, scrimDate: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Result</label>
                  <select
                    value={formData.result}
                    onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="win">Victory (Win)</option>
                    <option value="loss">Defeat (Loss)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Score</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 - 1"
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">MVP Player</label>
                  <input
                    type="text"
                    placeholder="e.g. Phantom"
                    value={formData.mvp}
                    onChange={(e) => setFormData({ ...formData, mvp: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Replay / VOD Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.vodLink}
                    onChange={(e) => setFormData({ ...formData, vodLink: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Coach Notes & Takeaways</label>
                <textarea
                  rows={2}
                  placeholder="Key rounds, errors to fix in next practice"
                  value={formData.coachNotes}
                  onChange={(e) => setFormData({ ...formData, coachNotes: e.target.value })}
                  className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#333538]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-[#8e918f] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
