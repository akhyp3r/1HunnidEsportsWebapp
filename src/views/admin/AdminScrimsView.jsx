import React, { useState } from 'react';
import { Swords, Plus, Clock, Calendar, Layers, MapPin, Trash2, Copy, Check, X } from 'lucide-react';
import { formatScrimTime, getDeviceTimezoneLabel, format24To12 } from '../../utils/time';

export default function AdminScrimsView({
  scrims,
  onCreateScrim,
  onDeleteScrim,
  isModalOpen,
  setIsModalOpen
}) {
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    opponent: '',
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    endTime: '22:30',
    timezone: getDeviceTimezoneLabel(),
    format: 'Best of 3 (Bo3)',
    maps: ['Ascent', 'Haven'],
    serverRegion: 'Singapore Central - 128 Tick',
    notes: ''
  });

  const availableMaps = ['Ascent', 'Haven', 'Bind', 'Sunset', 'Lotus', 'Split', 'Abyss'];

  const toggleMap = (mapName) => {
    setFormData(prev => ({
      ...prev,
      maps: prev.maps.includes(mapName)
        ? prev.maps.filter(m => m !== mapName)
        : [...prev.maps, mapName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.opponent || !formData.date || !formData.time) return;
    await onCreateScrim(formData);
    setIsModalOpen(false);
    setFormData({
      opponent: '',
      date: new Date().toISOString().split('T')[0],
      time: '20:00',
      endTime: '22:30',
      timezone: 'GMT+7',
      format: 'Best of 3 (Bo3)',
      maps: ['Ascent', 'Haven'],
      serverRegion: 'Singapore Central - 128 Tick',
      notes: ''
    });
  };

  const copyDiscordFormat = (scrim) => {
    const t = formatScrimTime(scrim);
    const text = `📢 **ONE HUNNID ESPORTS - SCRIM ANNOUNCEMENT**
━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Opponent: ${scrim.opponent}
⏰ Date & Time: ${t.localDate} @ ${t.localTime12h} (${t.deviceTz})${t.hasDiff ? ` [Original: ${t.originalTime12h} ${t.originalTz}]` : ''}
🏆 Format: ${scrim.format}
🗺️ Maps: ${scrim.maps?.join(', ') || 'TBD'}
📍 Server: ${scrim.serverRegion}
📝 Briefing: ${scrim.notes || 'Be on voice 15 mins prior.'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Free (${scrim.freeCount || 0}): ${scrim.rsvps?.filter(r => r.status === 'free').map(r => r.playerIgn).join(', ') || 'None yet'}
❌ Unavailable: ${scrim.rsvps?.filter(r => r.status === 'not_free').map(r => `${r.playerIgn} (${r.note || 'Busy'})`).join(', ') || 'None'}
👉 *Confirm your slot in the team portal!*`;

    navigator.clipboard.writeText(text);
    setCopiedId(scrim.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
            Scrim Management
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
            Scheduled Matches & Attendance Tally
          </h2>
          <p className="text-xs text-[#9a9c9e] mt-0.5">
            Broadcast scrim schedules and monitor live player attendance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Announce New Scrim</span>
        </button>
      </div>

      {/* Scrims List */}
      {scrims.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#1c1d1e] border border-dashed border-[#2e3032] text-center">
          <Swords className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No Scrims Scheduled</h3>
          <p className="text-xs text-[#9a9c9e] max-w-sm mx-auto mt-1">
            Click "Announce New Scrim" to schedule a practice match for your team.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {scrims.map((scrim) => (
            <div
              key={scrim.id}
              className={`p-6 rounded-3xl bg-[#1c1d1e] border transition-colors ${
                scrim.isToday ? 'border-red-500/40' : 'border-[#2e3032]'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#2e3032]">
                <div className="flex items-center gap-3">
                  {scrim.isToday && (
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      {scrim.isToday && (
                        <span className="text-[10px] font-bold uppercase text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                          TODAY
                        </span>
                      )}
                      <span className="text-xs text-[#9a9c9e] font-mono">{scrim.format}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      vs {scrim.opponent}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyDiscordFormat(scrim)}
                    className="p-2 rounded-full hover:bg-[#262729] text-zinc-400 hover:text-white border border-[#2e3032] transition-colors"
                    title="Copy Discord Ping"
                  >
                    {copiedId === scrim.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteScrim(scrim.id)}
                    className="p-2 rounded-full hover:bg-rose-950/20 text-zinc-500 hover:text-rose-400 border border-[#2e3032] transition-colors"
                    title="Cancel Scrim"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                {(() => {
                  const t = formatScrimTime(scrim);
                  return (
                    <>
                      <div className="p-3 rounded-2xl bg-[#131314] border border-[#262729]">
                        <div className="text-[11px] text-[#9a9c9e] mb-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-red-400" />
                          <span>Time (12h)</span>
                        </div>
                        <div className="text-xs font-bold text-white font-mono">{t.localTime12h}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">{t.localDate}</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#131314] border border-[#262729]">
                        <div className="text-[11px] text-[#9a9c9e] mb-0.5">Timezone</div>
                        <div className="text-xs font-bold text-white font-mono">{t.deviceTz} (Local)</div>
                        <div className="text-[10px] text-zinc-500 truncate" title={`Scheduled: ${t.originalTime12h} ${t.originalTz}`}>
                          {t.hasDiff ? `Sched: ${t.originalTime12h} ${t.originalTz}` : 'Device Synced'}
                        </div>
                      </div>
                    </>
                  );
                })()}

                <div className="p-3 rounded-2xl bg-[#131314] border border-[#262729]">
                  <div className="text-[11px] text-[#9a9c9e] mb-0.5">Maps</div>
                  <div className="text-xs font-bold text-white truncate">{scrim.maps?.join(', ') || 'TBD'}</div>
                </div>

                <div className="p-3 rounded-2xl bg-[#131314] border border-[#262729]">
                  <div className="text-[11px] text-[#9a9c9e] mb-0.5">Server / Lobby</div>
                  <div className="text-xs font-bold text-white truncate">{scrim.serverRegion}</div>
                </div>
              </div>

              {scrim.notes && (
                <div className="text-xs text-[#c4c7c5] p-3 rounded-2xl bg-[#131314] border border-[#262729] mb-4">
                  <span className="font-semibold text-white mr-1">Coach Notes:</span> {scrim.notes}
                </div>
              )}

              {/* Attendance Breakdown */}
              <div className="p-4 rounded-2xl bg-[#131314] border border-[#262729] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div className="text-zinc-400">
                  Player Attendance: <span className="text-emerald-400 font-bold">{scrim.freeCount || 0} Free</span> • <span className="text-rose-400 font-bold">{scrim.notFreeCount || 0} Busy</span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {scrim.rsvps?.map(r => (
                    <span
                      key={r.userId}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                        r.status === 'free'
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-950/40 text-rose-400 border-rose-500/30'
                      }`}
                      title={r.note || r.status}
                    >
                      {r.playerIgn}: {r.status === 'free' ? 'Free' : `Not Free ${r.note ? `(${r.note})` : ''}`}
                    </span>
                  ))}
                  {(!scrim.rsvps || scrim.rsvps.length === 0) && (
                    <span className="text-zinc-500 text-[11px]">No responses yet</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ANNOUNCE SCRIM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-[#1c1d1e] border border-[#2e3032] p-6 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2e3032]">
              <div>
                <h3 className="text-base font-bold text-white">Announce Scrim Schedule</h3>
                <p className="text-xs text-[#9a9c9e]">Schedule match time and notify team</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                  Opponent Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Vanguard, Team Singularity"
                  value={formData.opponent}
                  onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                  className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Scrim Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#c4c7c5]">
                      Scrim Time *
                    </label>
                    {formData.time && (
                      <span className="text-[11px] font-mono text-red-400 font-bold">
                        {format24To12(formData.time)} (12h)
                      </span>
                    )}
                  </div>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Match Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
                  >
                    <option value="Best of 1 (Bo1)">Best of 1 (Bo1)</option>
                    <option value="Best of 2 (Bo2)">Best of 2 (Bo2)</option>
                    <option value="Best of 3 (Bo3)">Best of 3 (Bo3)</option>
                    <option value="Best of 5 (Bo5)">Best of 5 (Bo5)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                    Server / Lobby
                  </label>
                  <input
                    type="text"
                    value={formData.serverRegion}
                    onChange={(e) => setFormData({ ...formData, serverRegion: e.target.value })}
                    className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                  Base Timezone (Auto-detected from Device: {getDeviceTimezoneLabel()})
                </label>
                <input
                  type="text"
                  placeholder={`e.g. ${getDeviceTimezoneLabel()}`}
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-red-500/60"
                />
              </div>

              {/* Map Checkboxes */}
              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-2">
                  Select Maps
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableMaps.map(mapName => {
                    const isSelected = formData.maps.includes(mapName);
                    return (
                      <button
                        type="button"
                        key={mapName}
                        onClick={() => toggleMap(mapName)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-red-600 text-white'
                            : 'bg-[#131314] text-zinc-400 border border-[#2f3133] hover:text-white'
                        }`}
                      >
                        {mapName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                  Coach Briefing / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Voice presence requirements, tactical instructions"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  Broadcast Scrim Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
