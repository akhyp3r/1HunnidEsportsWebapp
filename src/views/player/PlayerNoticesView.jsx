import React from 'react';
import { Megaphone, Pin } from 'lucide-react';

export default function PlayerNoticesView({ announcements }) {
  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
          Official Bulletins
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
          Team Notices & Updates
        </h2>
        <p className="text-xs text-[#9a9c9e] mt-0.5">
          Announcements and briefings from One Hunnid Esports management.
        </p>
      </div>

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#1c1d1e] border border-[#2e3032] text-center text-xs text-zinc-500">
            No announcements currently posted.
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl border transition-all ${
                ann.pinned
                  ? 'bg-[#1c1d1e] border-red-500/30'
                  : 'bg-[#1c1d1e] border-[#2e3032]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {ann.pinned && <Pin className="w-3.5 h-3.5 text-red-400 fill-red-400" />}
                  <h4 className="text-sm font-bold text-white">{ann.title}</h4>
                </div>
                <span className="text-[10px] text-zinc-500">
                  {new Date(ann.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-[#c4c7c5] leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>
              <div className="mt-3 pt-2 border-t border-[#262729] text-[10px] text-zinc-500">
                Posted by <span className="text-zinc-300 font-semibold">{ann.authorName}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
