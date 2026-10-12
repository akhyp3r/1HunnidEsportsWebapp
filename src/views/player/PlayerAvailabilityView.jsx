import React, { useState, useEffect } from 'react';
import { CalendarClock, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function PlayerAvailabilityView({ availabilityData, onUpdateAvailability }) {
  const { user } = useAuth();
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

  const [scheduleForm, setScheduleForm] = useState(
    daysOfWeek.map(day => ({
      dayOfWeek: day,
      timeSlot: '19:00 - 22:00 (Prime Scrim Slot)',
      note: ''
    }))
  );

  useEffect(() => {
    if (availabilityData?.mySchedule && availabilityData.mySchedule.length > 0) {
      setScheduleForm(
        daysOfWeek.map(day => {
          const entry = availabilityData.mySchedule.find(s => s.day === day);
          return {
            dayOfWeek: day,
            timeSlot: entry ? entry.timeSlot : '19:00 - 22:00 (Prime Scrim Slot)',
            note: entry ? entry.note : ''
          };
        })
      );
    }
  }, [availabilityData]);

  const handleDropdownChange = (day, newSlot) => {
    setScheduleForm(prev =>
      prev.map(item =>
        item.dayOfWeek === day ? { ...item, timeSlot: newSlot } : item
      )
    );
  };

  const handleNoteChange = (day, newNote) => {
    setScheduleForm(prev =>
      prev.map(item =>
        item.dayOfWeek === day ? { ...item, note: newNote } : item
      )
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onUpdateAvailability(scheduleForm);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
            Player Schedule
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
            Submit Daily Free Times
          </h2>
          <p className="text-xs text-[#9a9c9e] mt-0.5">
            Choose your daily availability range from the dropdown menu so management can book scrims.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Schedule Saved</span>
          </div>
        )}
      </div>

      {/* Main Schedule Container */}
      <div className="p-6 rounded-3xl bg-[#1c1d1e] border border-[#2e3032]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {scheduleForm.map((slot) => {
            const isBusy = slot.timeSlot.includes('Not Available');
            const isAllDay = slot.timeSlot.includes('All Day');

            return (
              <div
                key={slot.dayOfWeek}
                className="p-4 rounded-2xl bg-[#131314] border border-[#262729] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">
                      {slot.dayOfWeek}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isBusy 
                        ? 'bg-rose-950/40 text-rose-400 border border-rose-500/20' 
                        : isAllDay 
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-[#202123] text-zinc-300'
                    }`}>
                      {isBusy ? 'Busy' : isAllDay ? 'All Day' : 'Available'}
                    </span>
                  </div>

                  <label className="block text-[11px] text-[#9a9c9e] mb-1">
                    Free Time Range:
                  </label>
                  <select
                    value={slot.timeSlot}
                    onChange={(e) => handleDropdownChange(slot.dayOfWeek, e.target.value)}
                    className="w-full bg-[#1c1d1e] border border-[#2e3032] hover:border-[#3e4043] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500/60 transition-colors cursor-pointer"
                  >
                    {timeRangeOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[#1c1d1e] text-white">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Optional note (e.g. class ends 19:30)"
                    value={slot.note}
                    onChange={(e) => handleNoteChange(slot.dayOfWeek, e.target.value)}
                    className="w-full bg-[#1c1d1e]/50 border border-[#262729] rounded-xl px-3 py-1.5 text-[11px] text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-[#262729] flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Weekly Free Times'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
