import React, { useState, useEffect } from 'react';
import { 
  CalendarClock, 
  Check, 
  Clock, 
  Users, 
  Sparkles, 
  Save, 
  Calendar, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AvailabilityView({ 
  availabilityData, 
  onUpdateAvailability 
}) {
  const { user, isManager } = useAuth();
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const timeRangeOptions = [
    '18:00 - 21:00 (Early Evening Scrim)',
    '19:00 - 22:00 (Prime Scrim Slot)',
    '20:00 - 23:00 (Night Scrim Slot)',
    '21:00 - 01:00 (Late Night Practice)',
    '14:00 - 18:00 (Afternoon Slot)',
    '12:00 - 16:00 (Early Afternoon)',
    'All Day Available (Flexible)',
    'Not Available / Busy (No Scrims)'
  ];

  // Initialize schedule form from availabilityData.mySchedule
  const [myScheduleForm, setMyScheduleForm] = useState(
    daysOfWeek.map(day => ({
      dayOfWeek: day,
      timeSlot: '19:00 - 23:00 (Night Scrim Slot)',
      note: ''
    }))
  );

  useEffect(() => {
    if (availabilityData?.mySchedule && availabilityData.mySchedule.length > 0) {
      setMyScheduleForm(
        daysOfWeek.map(day => {
          const found = availabilityData.mySchedule.find(s => s.day === day);
          return {
            dayOfWeek: day,
            timeSlot: found ? found.timeSlot : '19:00 - 22:00 (Prime Scrim Slot)',
            note: found ? found.note : ''
          };
        })
      );
    }
  }, [availabilityData]);

  const handleDropdownChange = (day, newSlot) => {
    setMyScheduleForm(prev =>
      prev.map(item =>
        item.dayOfWeek === day ? { ...item, timeSlot: newSlot } : item
      )
    );
  };

  const handleNoteChange = (day, newNote) => {
    setMyScheduleForm(prev =>
      prev.map(item =>
        item.dayOfWeek === day ? { ...item, note: newNote } : item
      )
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onUpdateAvailability(myScheduleForm);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <CalendarClock className="w-4 h-4" />
            <span>Weekly Availability</span>
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Player Free Times & Team Roster Matrix
          </h2>
          <p className="text-xs text-[#8e918f] mt-0.5">
            Submit your free hours for each day of the week using dropdown ranges.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Free Times Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* SECTION 1: Player's Free Times Submission (Using Dropdown menus) */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#1e1f20] border border-[#333538] shadow-sm">
        <div className="flex items-center justify-between pb-5 border-b border-[#333538]/70">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>My Daily Free Times (Dropdown Selector)</span>
              <span className="text-xs font-normal text-zinc-400">({user?.ign || user?.name})</span>
            </h3>
            <p className="text-xs text-[#8e918f] mt-1">
              Select your free time range for each day from the dropdown menu so the coach can schedule matches when everyone is available.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Free Times</span>
              </>
            )}
          </button>
        </div>

        {/* 7 Days Dropdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {myScheduleForm.map((slot) => {
            const isUnavailable = slot.timeSlot.includes('Not Available');
            const isAllDay = slot.timeSlot.includes('All Day');

            return (
              <div
                key={slot.dayOfWeek}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnavailable
                    ? 'bg-[#181819] border-rose-950/60'
                    : isAllDay
                    ? 'bg-[#1c221e] border-emerald-900/40'
                    : 'bg-[#131314] border-[#333538]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white tracking-wide">
                    {slot.dayOfWeek}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isUnavailable
                      ? 'bg-rose-500/20 text-rose-400'
                      : isAllDay
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {isUnavailable ? 'Unavailable' : isAllDay ? 'All Day' : 'Evening'}
                  </span>
                </div>

                {/* Dropdown Menu */}
                <div className="mt-2">
                  <label className="block text-[11px] text-[#8e918f] mb-1 font-medium">
                    Choose Time Range:
                  </label>
                  <select
                    value={slot.timeSlot}
                    onChange={(e) => handleDropdownChange(slot.dayOfWeek, e.target.value)}
                    className="w-full bg-[#1e1f20] border border-[#333538] hover:border-[#4f5256] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
                  >
                    {timeRangeOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#1e1f20] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Optional Note input */}
                <div className="mt-2.5">
                  <input
                    type="text"
                    placeholder="Optional note (e.g. flexible after 19:00)"
                    value={slot.note}
                    onChange={(e) => handleNoteChange(slot.dayOfWeek, e.target.value)}
                    className="w-full bg-[#1e1f20]/60 border border-[#333538]/60 rounded-xl px-3 py-1.5 text-[11px] text-[#c4c7c5] placeholder-zinc-600 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Weekly Free Times'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: Full Team Roster Availability Heatmap & Matrix */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#1e1f20] border border-[#333538] shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-[#333538]/70">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Team 5-Man Availability Matrix</span>
            </h3>
            <p className="text-xs text-[#8e918f] mt-1">
              Real-time overview of every player's schedule across the week for optimal scrim planning.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#8e918f]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Busy
            </span>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto mt-6">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#333538] text-[#8e918f]">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Player</th>
                {daysOfWeek.map(day => (
                  <th key={day} className="py-3 px-3 font-semibold uppercase tracking-wider text-center">
                    {day.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333538]/50">
              {availabilityData?.matrix?.map(player => (
                <tr key={player.userId} className="hover:bg-[#282a2c]/30 transition-colors">
                  {/* Player info cell */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={player.avatar || '/assets/logo.png'} 
                        alt={player.ign} 
                        className="w-7 h-7 rounded-full object-cover border border-[#44474a]" 
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          {player.ign}
                          {player.userId === user?.id && (
                            <span className="text-[10px] px-1.5 rounded bg-red-500/20 text-red-400">YOU</span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#8e918f]">{player.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Day cells */}
                  {daysOfWeek.map(day => {
                    const slot = player.schedule?.find(s => s.day === day);
                    const text = slot?.timeSlot || 'Not Set';
                    const isBusy = text.includes('Not Available');
                    const isAllDay = text.includes('All Day');

                    // Extract clean short time
                    const shortTime = text.split('(')[0].trim();

                    return (
                      <td key={day} className="py-3.5 px-2 text-center">
                        <div 
                          className={`inline-block px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${
                            isBusy
                              ? 'bg-rose-950/30 border-rose-900/40 text-rose-400'
                              : isAllDay
                              ? 'bg-emerald-950/30 border-emerald-900/40 text-emerald-300'
                              : 'bg-[#131314] border-[#333538] text-zinc-200'
                          }`}
                          title={`${player.ign} - ${day}: ${text} ${slot?.note ? `(${slot.note})` : ''}`}
                        >
                          <div className="font-mono">{shortTime}</div>
                          {slot?.note && (
                            <div className="text-[9px] text-[#8e918f] truncate max-w-[80px]">
                              {slot.note}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
