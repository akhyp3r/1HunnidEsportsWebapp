const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('esports_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('esports_token', token);
  } else {
    localStorage.removeItem('esports_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),
  uploadAvatar: (formData) =>
    request('/upload/avatar', {
      method: 'POST',
      body: formData
    }),

  // Players
  getPlayers: () => request('/players'),
  createPlayer: (playerData) =>
    request('/players', {
      method: 'POST',
      body: JSON.stringify(playerData)
    }),
  updatePlayer: (id, playerData) =>
    request(`/players/${id}`, {
      method: 'PUT',
      body: JSON.stringify(playerData)
    }),
  deletePlayer: (id) =>
    request(`/players/${id}`, {
      method: 'DELETE'
    }),

  // Scrims
  getScrims: () => request('/scrims'),
  createScrim: (scrimData) =>
    request('/scrims', {
      method: 'POST',
      body: JSON.stringify(scrimData)
    }),
  updateScrim: (id, scrimData) =>
    request(`/scrims/${id}`, {
      method: 'PUT',
      body: JSON.stringify(scrimData)
    }),
  deleteScrim: (id) =>
    request(`/scrims/${id}`, {
      method: 'DELETE'
    }),
  rsvpScrim: (id, status, note) =>
    request(`/scrims/${id}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ status, note })
    }),

  // Availability
  getAvailability: () => request('/availability'),
  updateAvailability: (entries) =>
    request('/availability', {
      method: 'POST',
      body: JSON.stringify({ entries })
    }),

  // Announcements
  getAnnouncements: () => request('/announcements'),
  createAnnouncement: (annData) =>
    request('/announcements', {
      method: 'POST',
      body: JSON.stringify(annData)
    }),
  deleteAnnouncement: (id) =>
    request(`/announcements/${id}`, {
      method: 'DELETE'
    }),

  // Matches
  getMatches: () => request('/matches'),
  createMatch: (matchData) =>
    request('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData)
    }),

  // Playbook
  getPlaybook: () => request('/playbook'),
  createPlaybook: (item) =>
    request('/playbook', {
      method: 'POST',
      body: JSON.stringify(item)
    }),
  deletePlaybook: (id) =>
    request(`/playbook/${id}`, {
      method: 'DELETE'
    }),

  // Strategies (Valoplant Screenshots)
  getStrategies: () => request('/strategies'),
  createStrategy: (stratData) =>
    request('/strategies', {
      method: 'POST',
      body: JSON.stringify(stratData)
    }),
  deleteStrategy: (id) =>
    request(`/strategies/${id}`, {
      method: 'DELETE'
    })
};
