import React, { useState, useRef } from 'react';
import { Camera, Upload, Key, User, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export default function PlayerProfileView() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    ign: user?.ign || '',
    gameRole: user?.gameRole || '',
    discord: user?.discord || '',
    bio: user?.bio || '',
    avatar: user?.avatar || '/assets/logo.png',
    newPassword: ''
  });

  const presetAvatars = [
    '/assets/logo.png',
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      setErrorMsg('');
      const data = new FormData();
      data.append('avatar', file);

      const res = await api.uploadAvatar(data);
      setFormData(prev => ({ ...prev, avatar: res.avatarUrl }));
      updateUser({ avatar: res.avatarUrl });
      setSuccessMsg('Avatar updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to upload image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      const res = await api.updateProfile(formData);
      updateUser(res.user);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-red-400">
          Player Identity
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
          Edit Profile & Avatar (PFP)
        </h2>
        <p className="text-xs text-[#9a9c9e] mt-0.5">
          Manage your In-Game Name (IGN), custom profile picture, and login password.
        </p>
      </div>

      {successMsg && (
        <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 md:p-7 rounded-3xl bg-[#1c1d1e] border border-[#2e3032] space-y-5">
        {/* PFP UPLOAD */}
        <div className="p-4 rounded-2xl bg-[#131314] border border-[#262729] flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group">
            <img
              src={formData.avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-2xl object-cover border border-[#3e4043]"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] transition-opacity"
            >
              <Camera className="w-4 h-4 mb-0.5" />
              Change
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <div className="text-xs font-bold text-white">Profile Picture (PFP)</div>
            <div className="text-[11px] text-[#9a9c9e] mt-0.5">
              Upload an image from your device or pick a team preset.
            </div>

            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="px-3 py-1.5 rounded-full bg-[#202123] hover:bg-[#2b2c2e] text-white text-xs font-medium border border-[#2e3032] flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-zinc-400" />
                <span>{uploadingAvatar ? 'Uploading...' : 'Upload Image'}</span>
              </button>

              <div className="flex items-center gap-1.5 ml-2">
                {presetAvatars.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="preset"
                    onClick={() => setFormData({ ...formData, avatar: url })}
                    className={`w-6 h-6 rounded-full object-cover cursor-pointer border transition-transform ${
                      formData.avatar === url ? 'border-red-500 scale-110' : 'border-zinc-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* IGN and Real Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
              In-Game Name (IGN) *
            </label>
            <input
              type="text"
              required
              value={formData.ign}
              onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
              className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
              Real Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
            />
          </div>
        </div>

        {/* Role & Discord */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
              Team Role
            </label>
            <input
              type="text"
              value={formData.gameRole}
              onChange={(e) => setFormData({ ...formData, gameRole: e.target.value })}
              className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
              Discord Handle
            </label>
            <input
              type="text"
              value={formData.discord}
              onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
              className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
            Player Bio / Signature
          </label>
          <textarea
            rows={2}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-[#131314] border border-[#2f3133] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500/60"
          />
        </div>

        {/* Change Password */}
        <div className="p-4 rounded-2xl bg-[#131314] border border-[#262729]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300 mb-1">
            <Key className="w-3.5 h-3.5 text-zinc-400" />
            <span>Update Password (Optional)</span>
          </div>
          <p className="text-[11px] text-[#9a9c9e] mb-2">
            Change the default password created by your manager.
          </p>
          <input
            type="password"
            placeholder="Leave empty to keep current password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full bg-[#1c1d1e] border border-[#2e3032] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500/60"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
