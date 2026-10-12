import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When running on Vercel Serverless, the project directory is read-only.
// /tmp is the only writable directory on AWS Lambda / Vercel Functions.
const isVercel = process.env.VERCEL === '1' || process.env.NOW_REGION !== undefined;
const DATA_DIR = isVercel ? '/tmp/data' : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const ORIGINAL_DB_FILE = path.join(__dirname, 'data', 'db.json');
const UPLOADS_DIR = isVercel ? '/tmp/uploads' : path.join(__dirname, '..', 'public', 'uploads');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create DATA_DIR:', e);
}

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('Could not create UPLOADS_DIR:', e);
}

const defaultData = {
  users: [
    {
      id: "usr_admin",
      username: "admin",
      passwordHash: bcrypt.hashSync("admin123", 10),
      plainPasswordPreview: "admin123",
      role: "manager",
      name: "Team Director",
      ign: "OneHunnid_Boss",
      avatar: "/assets/logo.png",
      gameRole: "Owner / Head Coach",
      discord: "onehunnid#0001",
      bio: "One Hunnid Esports Operations Manager. Managing roster, scrim schedules, and team attendance.",
      status: "active",
      createdAt: new Date().toISOString()
    }
  ],
  scrims: [],
  availabilities: [],
  announcements: [
    {
      id: "ann_welcome",
      title: "Welcome to One Hunnid Esports Operations Hub",
      content: "This is the official portal for One Hunnid Esports. Use this hub to check scrim schedules, submit your daily free hours, and manage team attendance.",
      priority: "normal",
      pinned: true,
      authorName: "Management",
      authorRole: "manager",
      createdAt: new Date().toISOString()
    }
  ],
  matches: [],
  playbook: [],
  strategies: []
};

// Global in-memory cache across requests on the same worker
let memoryDb = null;

// Upstash Redis sync helper (if user provides UPSTASH_REDIS_REST_URL in Vercel)
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

async function syncWithRedis(data) {
  if (!redisUrl || !redisToken) return false;
  try {
    await fetch(`${redisUrl}/set/one_hunnid_db`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${redisToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return true;
  } catch (e) {
    console.warn('Redis sync error:', e);
    return false;
  }
}

export function getDb() {
  if (memoryDb && memoryDb.users && memoryDb.users.length > 0) {
    return memoryDb;
  }

  if (!fs.existsSync(DB_FILE)) {
    if (fs.existsSync(ORIGINAL_DB_FILE)) {
      try {
        const seedRaw = fs.readFileSync(ORIGINAL_DB_FILE, 'utf-8');
        const seedData = JSON.parse(seedRaw);
        saveDb(seedData);
        memoryDb = seedData;
        return seedData;
      } catch (e) {
        console.warn('Could not read original db seed:', e);
      }
    }
    saveDb(defaultData);
    memoryDb = defaultData;
    return defaultData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    memoryDb = parsed;
    return parsed;
  } catch (err) {
    console.error("Error reading database, falling back to defaults:", err);
    memoryDb = defaultData;
    return defaultData;
  }
}

export function saveDb(data) {
  memoryDb = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    if (redisUrl && redisToken) {
      syncWithRedis(data).catch(() => {});
    }
    return true;
  } catch (err) {
    console.error("Error saving database:", err);
    return false;
  }
}

// Reset helper to wipe fake data and write clean initial admin only
export function resetToInitialAdmin() {
  saveDb(defaultData);
  return defaultData;
}
