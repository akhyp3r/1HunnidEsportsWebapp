import React, { useState } from 'react';
import { Megaphone, Plus, Trash2, Pin, X } from 'lucide-react';

export default function AdminAnnouncementsView({
  announcements,
  onCreateAnnouncement,
  onDeleteAnnouncement
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    pinned: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;
    await onCreateAnnouncement(formData);
    setIsModalOpen(false);
    setFormData({ title: '', content: '', priority: 'normal', pinned: false });
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
            Team Broadcasts
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
            Official Announcements & Bulletins
          </h2>
          <p className="text-xs text-[#9a9c9e] mt-0.5">
            Post team notices that all players see on their portal.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Post Announcement</span>
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className={`p-5 rounded-2xl border transition-all ${
              ann.pinned ? 'bg-[#1c1d1e] border-red-500/30' : 'bg-[#1c1d1e] border-[#2e3032]'
            }`}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                {ann.pinned && <Pin className="w-3.5 h-3.5 text-red-400 fill-red-400" />}
                <h4 className="text-sm font-bold text-white">{ann.title}</h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">
                  {new Date(ann.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onDeleteAnnouncement(ann.id)}
                  className="p-1 text-zinc-500 hover:text-rose-400 rounded"
                  title="Delete Announcement"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-[#c4c7c5] leading-relaxed whitespace-pre-line">
              {ann.content}
            </p>

            <div className="mt-3 pt-2 border-t border-[#262729] text-[10px] text-zinc-500">
              Posted by <span className="text-zinc-300 font-semibold">{ann.authorName}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#1c1d1e] border border-[#2e3032] p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#2e3032]">
              <h3 className="text-base font-bold text-white">Post Team Announcement</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scrim warm-up protocol"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#131314] border border-[#2f3133] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500/60"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1">Content *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write message for the team..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#131314] border border-[#2f3133] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500/60"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinCheck"
                  checked={formData.pinned}
                  onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                  className="rounded bg-[#131314] border-[#2f3133] text-red-600 focus:ring-0"
                />
                <label htmlFor="pinCheck" className="text-xs text-zinc-300">
                  Pin to top of team bulletins
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#2e3032]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
