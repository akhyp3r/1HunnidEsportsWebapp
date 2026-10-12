import React from 'react';
import { CalendarClock, Users } from 'lucide-react';

export default function AdminAvailabilityView({ availabilityData }) {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const matrix = availabilityData?.matrix || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
          Squad Availability
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
          Team Availability Heatmap & Matrix
        </h2>
        <p className="text-xs text-[#9a9c9e] mt-0.5">
          Review every player's submitted weekly free hours to schedule scrims when everyone is ready.
        </p>
      </div>

      {matrix.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#1c1d1e] border border-dashed border-[#2e3032] text-center">
          <CalendarClock className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white">No Availability Submitted</h3>
          <p className="text-xs text-[#9a9c9e] max-w-sm mx-auto mt-1">
            Once you create players and they log into the player portal, their submitted free hours will appear here.
          </p>
        </div>
      ) : (
        <div className="p-6 rounded-3xl bg-[#1c1d1e] border border-[#2e3032]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#2e3032] text-[#9a9c9e]">
                  <th className="py-3 px-4 font-semibold uppercase">Player</th>
                  {daysOfWeek.map(day => (
                    <th key={day} className="py-3 px-3 font-semibold uppercase text-center">
                      {day.slice(0, 3)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262729]">
                {matrix.map(player => (
                  <tr key={player.userId} className="hover:bg-[#202123]/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={player.avatar || '/assets/logo.png'} 
                          alt={player.ign} 
                          className="w-7 h-7 rounded-full object-cover border border-[#3e4043]" 
                        />
                        <div>
                          <div className="font-bold text-white">{player.ign}</div>
                          <div className="text-[10px] text-zinc-500">{player.role}</div>
                        </div>
                      </div>
                    </td>

                    {daysOfWeek.map(day => {
                      const slot = player.schedule?.find(s => s.day === day);
                      const text = slot?.timeSlot || 'Not Set';
                      const isBusy = text.includes('Not Available');
                      const isAllDay = text.includes('All Day');
                      const shortTime = text.split('(')[0].trim();

                      return (
                        <td key={day} className="py-3.5 px-2 text-center">
                          <div 
                            className={`inline-block px-2 py-1 rounded-xl border text-[11px] font-mono ${
                              isBusy
                                ? 'bg-rose-950/20 border-rose-900/30 text-rose-400'
                                : isAllDay
                                ? 'bg-emerald-950/20 border-emerald-900/30 text-emerald-300'
                                : 'bg-[#131314] border-[#2e3032] text-zinc-300'
                            }`}
                            title={`${player.ign} - ${day}: ${text} ${slot?.note ? `(${slot.note})` : ''}`}
                          >
                            <div>{shortTime}</div>
                            {slot?.note && (
                              <div className="text-[9px] text-zinc-500 font-sans truncate max-w-[80px]">
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
      )}
    </div>
  );
}
