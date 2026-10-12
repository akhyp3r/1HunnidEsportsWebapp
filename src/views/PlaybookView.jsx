import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  MapPin, 
  Layers, 
  Trash2, 
  ShieldAlert, 
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PlaybookView({ playbook, onCreatePlaybook, onDeletePlaybook }) {
  const { isManager } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMapFilter, setSelectedMapFilter] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Attack Protocols',
    map: 'Ascent',
    content: ''
  });

  const maps = ['All', 'Haven', 'Ascent', 'Sunset', 'Bind', 'Lotus'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    await onCreatePlaybook(formData);
    setIsModalOpen(false);
    setFormData({
      title: '',
      category: 'Attack Protocols',
      map: 'Ascent',
      content: ''
    });
  };

  const filtered = playbook.filter(p => selectedMapFilter === 'All' || p.map === selectedMapFilter);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <BookOpen className="w-4 h-4" />
            <span>Tactics & Playbook</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Team Strats, Setups & Protocols
          </h2>
          <p className="text-xs text-[#8e918f] mt-0.5">
            Internal playbook for executions, map veto guidelines, and agent setups.
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Strategy</span>
          </button>
        )}
      </div>

      {/* Map Pills */}
      <div className="flex items-center gap-2 border-b border-[#333538] pb-3 overflow-x-auto">
        {maps.map(m => (
          <button
            key={m}
            onClick={() => setSelectedMapFilter(m)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedMapFilter === m
                ? 'bg-[#282a2c] text-white font-bold border border-[#44474a]'
                : 'text-[#8e918f] hover:text-white'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Strategies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-3xl bg-[#1e1f20] border border-[#333538] hover:border-[#474a4d] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#333538]/50">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                      {item.map}
                    </span>
                    <span className="text-[11px] text-[#8e918f]">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1.5">{item.title}</h4>
                </div>

                {isManager && (
                  <button
                    onClick={() => onDeletePlaybook(item.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-4 whitespace-pre-line text-xs text-[#c4c7c5] font-mono leading-relaxed bg-[#131314] p-4 rounded-2xl border border-[#333538]/50">
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD STRATEGY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#1e1f20] border border-[#333538] p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-[#333538]">
              <h3 className="text-lg font-bold text-white">Add New Strategy Protocol</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Strategy Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haven A-Site Fast Split"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Map</label>
                  <select
                    value={formData.map}
                    onChange={(e) => setFormData({ ...formData, map: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  >
                    {['Haven', 'Ascent', 'Sunset', 'Bind', 'Lotus', 'Split', 'Abyss'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Execution Steps</label>
                <textarea
                  rows={5}
                  required
                  placeholder="1. Smokes placed at 1:35&#10;2. Initiator flashes site&#10;3. Duelist executes default"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#131314] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
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
                  Save Strategy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
