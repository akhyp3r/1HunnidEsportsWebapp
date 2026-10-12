import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { getDb, saveDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'esports_hub_secret_key_987654321';

const isVercel = process.env.VERCEL === '1' || process.env.NOW_REGION !== undefined;
const uploadDir = isVercel ? '/tmp/uploads' : path.join(__dirname, '..', 'public', 'uploads');
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create uploadDir:', e);
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, `avatar_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets')));
app.use('/uploads', express.static(uploadDir));

// Authentication Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const db = getDb();
    let user = db.users.find(u => u.id === decoded.id || u.username.toLowerCase() === (decoded.username || '').toLowerCase());

    // If serverless container restarted and lost the runtime player record,
    // automatically recover the player from the verified JWT token:
    if (!user && decoded.id && decoded.username) {
      user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role || 'player',
        name: decoded.name || decoded.ign || decoded.username,
        ign: decoded.ign || decoded.username,
        avatar: decoded.avatar || '/assets/logo.png',
        gameRole: decoded.gameRole || 'Flex / Sub',
        discord: decoded.discord || '',
        bio: decoded.bio || 'One Hunnid Esports Active Player',
        status: 'active',
        createdAt: new Date().toISOString(),
        passwordHash: decoded.passwordHash || ''
      };
      db.users.push(user);
      saveDb(db);
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found. Please log in again.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

const requireManager = (req, res, next) => {
  if (req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Forbidden: Manager role required' });
  }
  next();
};

// ======================= AUTH ROUTES =======================

// Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const db = getDb();
  const searchName = username.trim().toLowerCase();
  const user = db.users.find(u => 
    u.username.toLowerCase() === searchName || 
    (searchName === 'manager' && u.username === 'admin')
  );
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. User not found.' });
  }

  const isValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid password. Check credentials.' });
  }

  // Include essential user attributes inside verified JWT token so that
  // serverless cold starts never lose identity
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      role: user.role,
      name: user.name,
      ign: user.ign,
      avatar: user.avatar,
      gameRole: user.gameRole,
      discord: user.discord,
      passwordHash: user.passwordHash
    },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  const safeUser = { ...user };
  delete safeUser.passwordHash;

  return res.json({ token, user: safeUser });
});

// Get Current User Profile
app.get('/api/auth/me', authenticate, (req, res) => {
  const safeUser = { ...req.user };
  delete safeUser.passwordHash;
  return res.json({ user: safeUser });
});

// Update Profile (Player or Manager can edit their own IGN, name, discord, avatar, bio, password)
app.put('/api/auth/profile', authenticate, (req, res) => {
  const { name, ign, gameRole, discord, bio, avatar, newPassword } = req.body;
  const db = getDb();
  const userIndex = db.users.findIndex(u => u.id === req.user.id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const user = db.users[userIndex];

  if (name !== undefined) user.name = name.trim();
  if (ign !== undefined) user.ign = ign.trim();
  if (gameRole !== undefined) user.gameRole = gameRole.trim();
  if (discord !== undefined) user.discord = discord.trim();
  if (bio !== undefined) user.bio = bio;
  if (avatar !== undefined) user.avatar = avatar;

  if (newPassword && newPassword.trim().length >= 4) {
    user.passwordHash = bcrypt.hashSync(newPassword.trim(), 10);
    user.plainPasswordPreview = newPassword.trim();
  }

  db.users[userIndex] = user;
  saveDb(db);

  const safeUser = { ...user };
  delete safeUser.passwordHash;
  return res.json({ message: 'Profile updated successfully', user: safeUser });
});

// Upload Avatar (PFP)
app.post('/api/upload/avatar', authenticate, upload.single('avatar'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const avatarUrl = `/uploads/${req.file.filename}`;
  const db = getDb();
  const userIndex = db.users.findIndex(u => u.id === req.user.id);
  if (userIndex !== -1) {
    db.users[userIndex].avatar = avatarUrl;
    saveDb(db);
  }

  return res.json({ avatarUrl, message: 'Profile avatar updated' });
});

// ======================= PLAYER MANAGEMENT ROUTES =======================

// Get all players
app.get('/api/players', authenticate, (req, res) => {
  const db = getDb();
  const isMgr = req.user.role === 'manager';

  const players = db.users.map(u => {
    const copy = { ...u };
    delete copy.passwordHash;
    // Only manager can view plaintext password preview for sharing credentials
    if (!isMgr) {
      delete copy.plainPasswordPreview;
    }
    return copy;
  });

  return res.json({ players });
});

// Add new player & create credentials (Manager only)
app.post('/api/players', authenticate, requireManager, (req, res) => {
  const { username, password, name, ign, gameRole, discord, bio, role = 'player', avatar } = req.body;

  if (!username || !password || !ign) {
    return res.status(400).json({ error: 'Username, password, and IGN (In-Game Name) are required' });
  }

  const db = getDb();
  const existing = db.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: `Username "${username}" is already taken` });
  }

  const newId = `usr_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const defaultAvatars = [
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  ];

  const newUser = {
    id: newId,
    username: username.trim(),
    passwordHash: bcrypt.hashSync(password.trim(), 10),
    plainPasswordPreview: password.trim(),
    role: role || 'player',
    name: name ? name.trim() : ign.trim(),
    ign: ign.trim(),
    avatar: avatar || defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
    gameRole: gameRole || 'Flex / Sub',
    discord: discord ? discord.trim() : '',
    bio: bio || 'One Hunnid Esports Active Player',
    status: 'active',
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);

  // Initialize weekly default availability for the new player
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.forEach(day => {
    db.availabilities.push({
      id: `av_${newId}_${day}`,
      userId: newId,
      dayOfWeek: day,
      timeSlot: '19:00 - 23:00',
      note: 'Default evening slot'
    });
  });

  saveDb(db);

  const safe = { ...newUser };
  delete safe.passwordHash;
  return res.status(201).json({ message: 'Player account and credentials created successfully', player: safe });
});

// Update player details or reset password (Manager only)
app.put('/api/players/:id', authenticate, requireManager, (req, res) => {
  const { id } = req.params;
  const { name, ign, gameRole, discord, bio, role, status, newPassword } = req.body;

  const db = getDb();
  const userIndex = db.users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Player not found' });
  }

  const user = db.users[userIndex];
  if (name !== undefined) user.name = name.trim();
  if (ign !== undefined) user.ign = ign.trim();
  if (gameRole !== undefined) user.gameRole = gameRole.trim();
  if (discord !== undefined) user.discord = discord.trim();
  if (bio !== undefined) user.bio = bio;
  if (role !== undefined) user.role = role;
  if (status !== undefined) user.status = status;

  if (newPassword && newPassword.trim()) {
    user.passwordHash = bcrypt.hashSync(newPassword.trim(), 10);
    user.plainPasswordPreview = newPassword.trim();
  }

  db.users[userIndex] = user;
  saveDb(db);

  const safe = { ...user };
  delete safe.passwordHash;
  return res.json({ message: 'Player details updated', player: safe });
});

// Remove / delete player (Manager only)
app.delete('/api/players/:id', authenticate, requireManager, (req, res) => {
  const { id } = req.params;
  if (id === req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own manager account' });
  }

  const db = getDb();
  const initialLength = db.users.length;
  db.users = db.users.filter(u => u.id !== id);

  if (db.users.length === initialLength) {
    return res.status(404).json({ error: 'Player not found' });
  }

  // Remove player's availability records and RSVPs
  db.availabilities = db.availabilities.filter(a => a.userId !== id);
  db.scrims.forEach(s => {
    s.rsvps = s.rsvps.filter(r => r.userId !== id);
  });

  saveDb(db);
  return res.json({ message: 'Player successfully removed from roster' });
});

// ======================= SCRIM SCHEDULE & RSVP ROUTES =======================

// List scrims with today's scrim indicator and player RSVP status
app.get('/api/scrims', authenticate, (req, res) => {
  const db = getDb();
  const todayStr = new Date().toISOString().split('T')[0];

  const enrichedScrims = db.scrims.map(s => {
    const isToday = s.date === todayStr;
    const myRsvp = s.rsvps.find(r => r.userId === req.user.id);

    // Enrich rsvps with player ign & name
    const enrichedRsvps = s.rsvps.map(r => {
      const u = db.users.find(user => user.id === r.userId);
      return {
        ...r,
        playerName: u ? u.name : 'Unknown',
        playerIgn: u ? u.ign : 'Unknown',
        playerRole: u ? u.gameRole : '',
        playerAvatar: u ? u.avatar : '/assets/logo.png'
      };
    });

    const freeCount = enrichedRsvps.filter(r => r.status === 'free').length;
    const notFreeCount = enrichedRsvps.filter(r => r.status === 'not_free').length;
    const totalPlayers = db.users.filter(u => u.role === 'player' && u.status === 'active').length;

    return {
      ...s,
      isToday,
      myRsvpStatus: myRsvp ? myRsvp.status : null,
      myRsvpNote: myRsvp ? myRsvp.note : '',
      rsvps: enrichedRsvps,
      freeCount,
      notFreeCount,
      pendingCount: Math.max(0, totalPlayers - (freeCount + notFreeCount))
    };
  });

  // Sort upcoming first
  enrichedScrims.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  return res.json({ scrims: enrichedScrims });
});

// Announce new scrim schedule (Manager only)
app.post('/api/scrims', authenticate, requireManager, (req, res) => {
  const { title, opponent, date, time, endTime, timezone, format, maps, serverRegion, notes } = req.body;

  if (!opponent || !date || !time) {
    return res.status(400).json({ error: 'Opponent, date, and scrim time are required' });
  }

  const db = getDb();
  const newScrim = {
    id: `scrim_${Date.now()}`,
    title: title || `Scrim vs ${opponent}`,
    opponent,
    date, // YYYY-MM-DD
    time, // HH:mm
    endTime: endTime || '',
    timezone: timezone || 'GMT+7',
    format: format || 'Bo3',
    maps: Array.isArray(maps) ? maps : (maps ? [maps] : ['Ascent', 'Haven']),
    serverRegion: serverRegion || 'Custom Lobby',
    notes: notes || '',
    status: 'upcoming',
    rsvps: [],
    createdBy: req.user.id,
    createdAt: new Date().toISOString()
  };

  db.scrims.unshift(newScrim);

  // Also auto-post a team announcement
  db.announcements.unshift({
    id: `ann_scrim_${Date.now()}`,
    title: `🚨 New Scrim Announced vs ${opponent}`,
    content: `Scheduled for ${date} at ${time} (${newScrim.timezone}). Format: ${newScrim.format}. Maps: ${newScrim.maps.join(', ')}. Please mark your availability in the Scrim Dashboard!`,
    priority: 'urgent',
    pinned: true,
    authorName: `${req.user.name} (${req.user.role})`,
    authorRole: req.user.role,
    createdAt: new Date().toISOString()
  });

  saveDb(db);
  return res.status(201).json({ message: 'Scrim announced successfully and team notified', scrim: newScrim });
});

// Update scrim
app.put('/api/scrims/:id', authenticate, requireManager, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const idx = db.scrims.findIndex(s => s.id === id);

  if (idx === -1) {
    return res.status(404).json({ error: 'Scrim not found' });
  }

  db.scrims[idx] = { ...db.scrims[idx], ...req.body };
  saveDb(db);
  return res.json({ message: 'Scrim updated', scrim: db.scrims[idx] });
});

// Delete scrim
app.delete('/api/scrims/:id', authenticate, requireManager, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.scrims = db.scrims.filter(s => s.id !== id);
  saveDb(db);
  return res.json({ message: 'Scrim deleted' });
});

// Mark RSVP: "free" or "not_free" for a scrim
app.post('/api/scrims/:id/rsvp', authenticate, (req, res) => {
  const { id } = req.params;
  const { status, note = '' } = req.body; // status: 'free' or 'not_free'

  if (!['free', 'not_free'].includes(status)) {
    return res.status(400).json({ error: 'Status must be either "free" or "not_free"' });
  }

  const db = getDb();
  const scrim = db.scrims.find(s => s.id === id);
  if (!scrim) {
    return res.status(404).json({ error: 'Scrim not found' });
  }

  const existingRsvpIndex = scrim.rsvps.findIndex(r => r.userId === req.user.id);
  const rsvpEntry = {
    userId: req.user.id,
    status,
    note: note ? note.trim() : '',
    updatedAt: new Date().toISOString()
  };

  if (existingRsvpIndex !== -1) {
    scrim.rsvps[existingRsvpIndex] = rsvpEntry;
  } else {
    scrim.rsvps.push(rsvpEntry);
  }

  saveDb(db);
  return res.json({
    message: status === 'free' ? 'Marked as FREE to play this scrim!' : 'Marked as NOT FREE for this scrim',
    rsvp: rsvpEntry
  });
});

// ======================= AVAILABILITY SECTION =======================

// Get all availability records
app.get('/api/availability', authenticate, (req, res) => {
  const db = getDb();
  const users = db.users.filter(u => u.role === 'player' && u.status === 'active');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Build matrix for each player
  const matrix = users.map(u => {
    const playerAvail = daysOfWeek.map(day => {
      const entry = db.availabilities.find(a => a.userId === u.id && a.dayOfWeek === day);
      return {
        day,
        timeSlot: entry ? entry.timeSlot : 'Not Specified',
        note: entry ? entry.note : ''
      };
    });

    return {
      userId: u.id,
      name: u.name,
      ign: u.ign,
      role: u.gameRole,
      avatar: u.avatar,
      schedule: playerAvail
    };
  });

  // Current user's own availability list
  const mySchedule = daysOfWeek.map(day => {
    const entry = db.availabilities.find(a => a.userId === req.user.id && a.dayOfWeek === day);
    return {
      day,
      timeSlot: entry ? entry.timeSlot : '19:00 - 23:00',
      note: entry ? entry.note : ''
    };
  });

  return res.json({ matrix, mySchedule, daysOfWeek });
});

// Player updates their availability for a day or all week
app.post('/api/availability', authenticate, (req, res) => {
  const { entries } = req.body; // array of { dayOfWeek, timeSlot, note }

  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ error: 'Entries array is required' });
  }

  const db = getDb();

  entries.forEach(item => {
    const { dayOfWeek, timeSlot, note = '' } = item;
    if (!dayOfWeek || !timeSlot) return;

    const idx = db.availabilities.findIndex(a => a.userId === req.user.id && a.dayOfWeek === dayOfWeek);
    if (idx !== -1) {
      db.availabilities[idx].timeSlot = timeSlot;
      db.availabilities[idx].note = note;
    } else {
      db.availabilities.push({
        id: `av_${req.user.id}_${dayOfWeek}`,
        userId: req.user.id,
        dayOfWeek,
        timeSlot,
        note
      });
    }
  });

  saveDb(db);
  return res.json({ message: 'Your weekly availability has been updated successfully!' });
});

// ======================= ANNOUNCEMENTS =======================

app.get('/api/announcements', authenticate, (req, res) => {
  const db = getDb();
  return res.json({ announcements: db.announcements || [] });
});

app.post('/api/announcements', authenticate, (req, res) => {
  const { title, content, priority = 'normal', pinned = false } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const db = getDb();
  const newAnn = {
    id: `ann_${Date.now()}`,
    title: title.trim(),
    content: content.trim(),
    priority,
    pinned: Boolean(pinned),
    authorName: `${req.user.ign || req.user.name} (${req.user.role})`,
    authorRole: req.user.role,
    createdAt: new Date().toISOString()
  };

  db.announcements.unshift(newAnn);
  saveDb(db);
  return res.status(201).json({ announcement: newAnn });
});

app.delete('/api/announcements/:id', authenticate, requireManager, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.announcements = db.announcements.filter(a => a.id !== id);
  saveDb(db);
  return res.json({ message: 'Announcement deleted' });
});

// ======================= MATCH RESULTS & VODS =======================

app.get('/api/matches', authenticate, (req, res) => {
  const db = getDb();
  return res.json({ matches: db.matches || [] });
});

app.post('/api/matches', authenticate, requireManager, (req, res) => {
  const { opponent, scrimDate, format, result, score, mapsPlayed, vodLink, mvp, coachNotes } = req.body;
  const db = getDb();

  const newMatch = {
    id: `match_${Date.now()}`,
    opponent: opponent || 'Unknown Opponent',
    scrimDate: scrimDate || new Date().toISOString().split('T')[0],
    format: format || 'Bo3',
    result: result || 'win',
    score: score || '2 - 0',
    mapsPlayed: mapsPlayed || [],
    vodLink: vodLink || '',
    mvp: mvp || '',
    coachNotes: coachNotes || ''
  };

  db.matches.unshift(newMatch);
  saveDb(db);
  return res.status(201).json({ match: newMatch });
});

// ======================= TEAM PLAYBOOK =======================

app.get('/api/playbook', authenticate, (req, res) => {
  const db = getDb();
  return res.json({ playbook: db.playbook || [] });
});

app.post('/api/playbook', authenticate, (req, res) => {
  const { title, category, map, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const db = getDb();
  const item = {
    id: `strat_${Date.now()}`,
    title: title.trim(),
    category: category || 'General Strategy',
    map: map || 'All Maps',
    content: content.trim()
  };

  db.playbook.unshift(item);
  saveDb(db);
  return res.status(201).json({ playbookItem: item });
});

app.delete('/api/playbook/:id', authenticate, requireManager, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  db.playbook = db.playbook.filter(p => p.id !== id);
  saveDb(db);
  return res.json({ message: 'Strategy deleted' });
});

// ======================= STRATEGIES (SCREENSHOTS) =======================

const stratsUploadDir = path.join(uploadDir, 'strats');
try {
  if (!fs.existsSync(stratsUploadDir)) {
    fs.mkdirSync(stratsUploadDir, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create stratsUploadDir:', e);
}

app.get('/api/strategies', authenticate, (req, res) => {
  const db = getDb();
  return res.json({ strategies: db.strategies || [] });
});

app.post('/api/strategies', authenticate, (req, res) => {
  try {
    const { title, map, site, notes, imageBase64 } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Strat title is required' });
    }
    if (!map) {
      return res.status(400).json({ error: 'Map is required' });
    }
    if (!imageBase64) {
      return res.status(400).json({ error: 'Screenshot image is required' });
    }

    // Process base64 image data (e.g. data:image/png;base64,.... or data:image/jpeg;base64,....)
    let ext = '.png';
    let base64Data = imageBase64;

    const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    if (matches) {
      const mimeSub = matches[1].toLowerCase();
      ext = mimeSub === 'jpeg' || mimeSub === 'jpg' ? '.jpg' : '.png';
      base64Data = matches[2];
    }

    const filename = `strat_${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
    const filePath = path.join(stratsUploadDir, filename);

    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

    const db = getDb();
    if (!db.strategies) {
      db.strategies = [];
    }

    const newStrat = {
      id: `strat_snap_${Date.now()}`,
      title: title.trim(),
      map: map.trim(),
      site: site ? site.trim() : 'Default',
      notes: notes ? notes.trim() : '',
      imageUrl: `/uploads/strats/${filename}`,
      authorName: req.user.ign || req.user.name,
      authorRole: req.user.role,
      authorId: req.user.id,
      createdAt: new Date().toISOString()
    };

    db.strategies.unshift(newStrat);
    saveDb(db);

    return res.status(201).json({ strategy: newStrat });
  } catch (err) {
    console.error('Error saving strategy:', err);
    return res.status(500).json({ error: 'Failed to save strategy screenshot' });
  }
});

app.delete('/api/strategies/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  const strat = (db.strategies || []).find(s => s.id === id);

  if (!strat) {
    return res.status(404).json({ error: 'Strategy not found' });
  }

  // Only manager or the strat author can delete
  if (req.user.role !== 'manager' && strat.authorId !== req.user.id) {
    return res.status(403).json({ error: 'Permission denied to delete this strategy' });
  }

  // Optionally delete file
  if (strat.imageUrl) {
    const filename = path.basename(strat.imageUrl);
    const filePath = path.join(stratsUploadDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Failed to unlink strategy image:', e);
      }
    }
  }

  db.strategies = (db.strategies || []).filter(s => s.id !== id);
  saveDb(db);
  return res.json({ message: 'Strategy screenshot deleted successfully' });
});

// Serve frontend build in production if available
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (process.env.NODE_ENV !== 'production' || !isVercel) {
  app.listen(PORT, () => {
    console.log(`Esports Hub backend running at http://localhost:${PORT}`);
  });
}

export default app;
