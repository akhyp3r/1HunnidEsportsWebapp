import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  Check, 
  Key, 
  User, 
  Sparkles, 
  Shield, 
  Save,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ProfileModal({ isOpen, onClose }) {
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

  if (!isOpen || !user) return null;

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
      setSuccessMsg('Avatar uploaded successfully!');
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
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-[#1e1f20] border border-[#333538] p-6 md:p-7 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#333538]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-red-500/20 text-red-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Player Profile & Settings</h3>
              <p className="text-xs text-[#8e918f]">Update your public IGN, PFP avatar, and credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#282a2c] text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 mt-5">
          {/* PFP (Profile Picture) Upload Section */}
          <div className="p-4 rounded-2xl bg-[#131314] border border-[#333538] flex flex-col sm:flex-row items-center gap-4">
            <div className="relative group">
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-red-500/50 shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold transition-opacity"
              >
                <Camera className="w-5 h-5 mb-1" />
                Change
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-xs font-bold text-white">Profile Picture (PFP)</h4>
              <p className="text-[11px] text-[#8e918f] mt-0.5">
                Upload custom image from your device or pick a team preset avatar below.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
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
                  className="px-3 py-1.5 rounded-full bg-[#282a2c] hover:bg-[#37393b] text-white text-xs font-medium border border-[#333538] flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingAvatar ? 'Uploading...' : 'Upload Image'}</span>
                </button>

                {/* Preset Avatars */}
                <div className="flex items-center gap-1.5 ml-2">
                  {presetAvatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="preset"
                      onClick={() => setFormData({ ...formData, avatar: url })}
                      className={`w-7 h-7 rounded-full object-cover cursor-pointer border transition-transform hover:scale-110 ${
                        formData.avatar === url ? 'border-red-500 scale-105' : 'border-zinc-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields */}
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
                className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
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
                className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#c4c7c5] mb-1.5">
                Main Game Role
              </label>
              <input
                type="text"
                value={formData.gameRole}
                onChange={(e) => setFormData({ ...formData, gameRole: e.target.value })}
                className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
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
                className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
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
              className="w-full bg-[#131314] border border-[#333538] rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Change Password */}
          <div className="p-4 rounded-2xl bg-[#131314] border border-[#333538]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 mb-1.5">
              <Key className="w-3.5 h-3.5 text-red-400" />
              <span>Change Login Password (Optional)</span>
            </div>
            <p className="text-[11px] text-[#8e918f] mb-2">
              Update the initial password given by your manager.
            </p>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full bg-[#1e1f20] border border-[#333538] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#333538]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs text-[#8e918f] hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
