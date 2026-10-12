/**
 * Timezone and 12-hour clock formatting utilities for One Hunnid Esports
 */

// Parse offset in minutes from timezone string like "GMT+7", "UTC+6:30", "GMT-5", "EST", etc.
export function parseTimezoneOffset(tzStr) {
  if (!tzStr) return null;
  const clean = tzStr.trim().toUpperCase();

  // Match GMT+7, UTC+7, GMT+6:30, GMT-5, UTC-04:00
  const match = clean.match(/(?:GMT|UTC)?\s*([+-])\s*(\d{1,2})(?::(\d{2}))?/);
  if (match) {
    const sign = match[1] === '-' ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const mins = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours * 60 + mins);
  }

  // Common named timezone offsets in minutes
  const namedOffsets = {
    'EST': -5 * 60,
    'EDT': -4 * 60,
    'CST': -6 * 60,
    'CDT': -5 * 60,
    'MST': -7 * 60,
    'MDT': -6 * 60,
    'PST': -8 * 60,
    'PDT': -7 * 60,
    'UTC': 0,
    'GMT': 0,
    'WET': 0,
    'CET': 1 * 60,
    'CEST': 2 * 60,
    'EET': 2 * 60,
    'EEST': 3 * 60,
    'MSK': 3 * 60,
    'GST': 4 * 60,
    'IST': 5.5 * 60,
    'BST': 6 * 60,
    'MMT': 6.5 * 60, // Myanmar Time
    'ICT': 7 * 60,   // Indochina Time (Bangkok, Hanoi, Jakarta)
    'WIB': 7 * 60,
    'SGT': 8 * 60,   // Singapore Time
    'MYT': 8 * 60,   // Malaysia Time
    'PHT': 8 * 60,   // Philippines Time
    'CST_ASIA': 8 * 60,
    'JST': 9 * 60,   // Japan Standard Time
    'KST': 9 * 60,   // Korea Standard Time
    'AEST': 10 * 60,
    'AEDT': 11 * 60,
    'NZST': 12 * 60
  };

  if (namedOffsets[clean] !== undefined) {
    return namedOffsets[clean];
  }

  // Fallback: device's own offset
  return -new Date().getTimezoneOffset();
}

// Convert 24-hour time "20:00" into 12-hour string "8:00 PM"
export function format24To12(time24) {
  if (!time24) return '';
  const parts = time24.split(':');
  if (parts.length < 2) return time24;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1].padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${period}`;
}

// Get user device's local timezone abbreviation / label (e.g. "MMT", "GMT+6:30", "EDT")
export function getDeviceTimezoneLabel() {
  try {
    const d = new Date();
    // Try to get short name
    const formatted = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).format(d);
    const parts = formatted.split(' ');
    const shortName = parts[parts.length - 1];
    if (shortName && shortName.length <= 8) {
      return shortName;
    }
  } catch (e) {
    // ignore
  }

  // Calculate GMT offset
  const offsetMins = -new Date().getTimezoneOffset();
  const sign = offsetMins >= 0 ? '+' : '-';
  const absMins = Math.abs(offsetMins);
  const h = Math.floor(absMins / 60);
  const m = absMins % 60;
  return `GMT${sign}${h}${m > 0 ? `:${m.toString().padStart(2, '0')}` : ''}`;
}

/**
 * Automatically adjusts a scrim's scheduled date and time to the user device's local timezone,
 * formatted in 12-hour clock (e.g. "7:30 PM").
 */
export function formatScrimTime(scrim) {
  if (!scrim || !scrim.time) {
    return {
      localTime12h: '--:--',
      localDate: '',
      isToday: false,
      deviceTz: getDeviceTimezoneLabel(),
      originalTime12h: '',
      hasDiff: false
    };
  }

  const dateStr = scrim.date || new Date().toISOString().split('T')[0];
  const timeStr = scrim.time; // e.g. "20:00"
  const tzStr = scrim.timezone || 'GMT+7';

  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  const offsetMins = parseTimezoneOffset(tzStr);

  let dateObj;
  if (offsetMins !== null && !isNaN(offsetMins)) {
    // Construct exact UTC timestamp
    const utcEpoch = Date.UTC(year, month - 1, day, hours, minutes);
    const absoluteTimestamp = utcEpoch - (offsetMins * 60 * 1000);
    dateObj = new Date(absoluteTimestamp);
  } else {
    // Fallback to local parsing
    dateObj = new Date(year, month - 1, day, hours, minutes);
  }

  // Format to user device's local 12-hour clock
  const localTime12h = dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Local Date formatting
  const today = new Date();
  const isToday =
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate();

  const localDate = isToday
    ? 'Today'
    : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  // Original scheduled 12-hour time
  const originalTime12h = format24To12(timeStr);
  const deviceTz = getDeviceTimezoneLabel();

  // Check if there is a difference between local display and original scheduled string
  const hasDiff = localTime12h !== originalTime12h || (tzStr && tzStr !== deviceTz);

  return {
    localTime12h,           // e.g. "7:30 PM"
    localDate,              // e.g. "Today" or "Oct 12, 2026"
    isToday,                // boolean (matches device today)
    deviceTz,               // e.g. "MMT" or "GMT+6:30"
    originalTime12h,        // e.g. "8:00 PM"
    originalTz: tzStr,      // e.g. "GMT+7"
    hasDiff,
    displayFull: `${localTime12h} (${deviceTz})`
  };
}
