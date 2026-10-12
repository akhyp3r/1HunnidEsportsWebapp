import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  ExternalLink, 
  AppWindow, 
  Upload, 
  Image as ImageIcon, 
  X, 
  Check, 
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight,
  Maximize2,
  Plus,
  Compass,
  FileCheck2,
  Trash2,
  ClipboardPaste
} from 'lucide-react';
import { api } from '../services/api';

export const VALORANT_MAPS = [
  'Abyss',
  'Ascent',
  'Haven',
  'Lotus',
  'Split',
  'Summit',
  'Sunset',
  'Bind',
  'Breeze',
  'Corrode',
  'Fracture',
  'Icebox',
  'Pearl'
];

export function getSitesForMap(mapName) {
  if (!mapName) return ['Default', 'A', 'B'];
  const normalized = mapName.trim().toLowerCase();
  if (normalized === 'lotus' || normalized === 'haven') {
    return ['Default', 'A', 'B', 'C'];
  }
  return ['Default', 'A', 'B'];
}

export default function ValoplantView({ onStratSaved, onNavigateToStrategies }) {
  const [selectedMap, setSelectedMap] = useState('Abyss');
  const [selectedSite, setSelectedSite] = useState('Default');
  const [stratTitle, setStratTitle] = useState('');
  const [stratNotes, setStratNotes] = useState('');
  
  // Image State
  const [previewImage, setPreviewImage] = useState(null); // base64 string
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScreenCapturing, setIsScreenCapturing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  // Update site options when map changes
  const availableSites = getSitesForMap(selectedMap);

  useEffect(() => {
    // If the currently selected site is not in available sites (e.g. C on a non-Haven/Lotus map), reset to Default
    if (!availableSites.includes(selectedSite)) {
      setSelectedSite('Default');
    }
  }, [selectedMap]);

  // Open Valoplant in a dedicated standalone window / tab
  const openAppWindow = () => {
    const width = 1360;
    const height = 860;
    const left = Math.max(0, (window.screen.width - width) / 2);
    const top = Math.max(0, (window.screen.height - height) / 2);
    window.open(
      'https://valoplant.gg/',
      'ValoplantTacticsWindow',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
  };

  // Screen / Window capture API using standard navigator.mediaDevices.getDisplayMedia
  const handleScreenshotCapture = async () => {
    setErrorMessage('');
    setIsScreenCapturing(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Display media capture is not supported in this browser. Please use the Upload or Paste option.');
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'window',
          cursor: 'never'
        },
        audio: false
      });

      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const bitmap = await imageCapture.grabFrame();
      
      track.stop();
      stream.getTracks().forEach(t => t.stop());

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(bitmap, 0, 0);

      const dataUrl = canvas.toDataURL('image/png', 0.95);
      setPreviewImage(dataUrl);
      if (!stratTitle) {
        setStratTitle(`${selectedMap} - ${selectedSite === 'Default' ? 'Default Setup' : selectedSite + ' Site'}`);
      }
    } catch (err) {
      console.warn('Screen capture cancelled or error:', err);
      if (err.name !== 'NotAllowedError') {
        setErrorMessage(err.message || 'Screen capture could not be initialized. You can upload an image or press Ctrl+V to paste!');
      }
    } finally {
      setIsScreenCapturing(false);
    }
  };

  // Process file upload
  const processImageFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file (PNG, JPG, or WEBP).');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
      if (!stratTitle) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setStratTitle(cleanName || `${selectedMap} - ${selectedSite === 'Default' ? 'Default Setup' : selectedSite + ' Site'}`);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    e.target.value = '';
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Clipboard Paste (Ctrl+V) anywhere on this page
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            processImageFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [selectedMap, selectedSite, stratTitle]);

  // Save Strat to backend
  const handleSaveStrategy = async (e) => {
    e.preventDefault();
    if (!previewImage) {
      setErrorMessage('Please upload, paste (Ctrl+V), or capture a strategy screenshot first.');
      return;
    }
    if (!stratTitle.trim()) {
      setErrorMessage('Please enter a title for this strategy.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');
      const res = await api.createStrategy({
        title: stratTitle.trim(),
        map: selectedMap,
        site: selectedSite,
        notes: stratNotes.trim(),
        imageBase64: previewImage
      });

      setSaveSuccess(true);
      if (onStratSaved) {
        onStratSaved(res.strategy);
      }

      setTimeout(() => {
        setSaveSuccess(false);
        setPreviewImage(null);
        setStratTitle('');
        setStratNotes('');
        if (onNavigateToStrategies) {
          onNavigateToStrategies();
        }
      }, 1200);
    } catch (err) {
      console.error('Failed to save strategy:', err);
      setErrorMessage(err.message || 'Failed to save strategy screenshot.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner / Link Card for Valoplant */}
      <div className="p-6 md:p-7 rounded-3xl bg-[#1c1d1e] border border-[#2e3032] relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#131314] border border-[#2e3032] flex items-center justify-center flex-shrink-0">
            <Layers className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                Tactical Playbook Tool
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                valoplant.gg
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
              Valoplant Strategy Creator
            </h2>
            <p className="text-xs text-[#9a9c9e] mt-1 leading-relaxed max-w-xl">
              Design lineups, executes, and agent setups on Valoplant. Then take a screenshot (<kbd className="px-1.5 py-0.5 rounded bg-[#131314] border border-[#2e3032] text-zinc-300 font-mono text-[10px]">Win + Shift + S</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-[#131314] border border-[#2e3032] text-zinc-300 font-mono text-[10px]">PrtScn</kbd>) and paste or upload it directly below to save it into the team repository.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-start md:justify-end">
          <button
            onClick={openAppWindow}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#202123] hover:bg-[#282a2c] text-white text-xs font-semibold border border-[#2e3032] transition-colors shadow-sm"
            title="Open Valoplant in a clean standalone pop-out window"
          >
            <AppWindow className="w-4 h-4 text-zinc-400" />
            <span>Pop-Out Window</span>
          </button>

          <a
            href="https://valoplant.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
          >
            <span>Open Valoplant</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Manual Strat Entry Form */}
      <div className="rounded-3xl bg-[#1c1d1e] border border-[#2e3032] p-6 md:p-8 shadow-sm space-y-6">
        <div className="border-b border-[#262729] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base md:text-lg font-bold text-white">
              Save Strategy Screenshot & Details
            </h3>
            <p className="text-xs text-[#9a9c9e] mt-0.5">
              Choose the map and site, then upload or paste your strat picture.
            </p>
          </div>
          <button
            onClick={onNavigateToStrategies}
            className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>View All Saved Strategies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>Strategy saved successfully! Redirecting to the Strategies library...</span>
          </div>
        )}

        <form onSubmit={handleSaveStrategy} className="space-y-6">
          {/* Map and Site Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Map Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Map <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedMap}
                onChange={(e) => setSelectedMap(e.target.value)}
                className="w-full bg-[#131314] text-white text-xs font-semibold rounded-2xl px-4 py-3 border border-[#2e3032] focus:border-red-500 focus:outline-none cursor-pointer"
                required
              >
                {VALORANT_MAPS.map((map) => (
                  <option key={map} value={map}>
                    {map}
                  </option>
                ))}
              </select>
            </div>

            {/* Site Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300">
                  Site <span className="text-red-400">*</span>
                </label>
                {(selectedMap === 'Haven' || selectedMap === 'Lotus') && (
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                    3-Site Map (A, B, C)
                  </span>
                )}
              </div>
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="w-full bg-[#131314] text-white text-xs font-semibold rounded-2xl px-4 py-3 border border-[#2e3032] focus:border-red-500 focus:outline-none cursor-pointer"
                required
              >
                {availableSites.map((site) => (
                  <option key={site} value={site}>
                    {site === 'Default' ? 'Default' : `${site} Site`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Strategy Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={stratTitle}
              onChange={(e) => setStratTitle(e.target.value)}
              placeholder="e.g. Ascent A Site Retake with Fade & Omen"
              className="w-full bg-[#131314] text-white text-xs rounded-2xl px-4 py-3 border border-[#2e3032] focus:border-red-500 focus:outline-none"
              required
            />
          </div>

          {/* Screenshot Upload / Paste Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-zinc-300">
                Strategy Screenshot Frame (PNG / JPG) <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                <ClipboardPaste className="w-3.5 h-3.5 text-zinc-400" />
                <span>You can press <kbd className="px-1.5 py-0.5 rounded bg-[#131314] border border-[#2e3032] text-zinc-300 font-mono text-[10px]">Ctrl+V</kbd> to paste</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
            />

            {previewImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#2e3032] bg-[#131314] flex flex-col items-center justify-center p-3 group">
                <img
                  src={previewImage}
                  alt="Strat Preview"
                  className="w-full max-h-96 object-contain rounded-xl"
                />
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#202123] hover:bg-[#282a2c] text-white text-xs font-semibold border border-[#3e4043] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Replace Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewImage(null)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-950/70 hover:bg-red-900 text-red-300 text-xs font-semibold border border-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-8 md:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? 'border-red-500 bg-red-500/5'
                    : 'border-[#2e3032] hover:border-red-500/50 bg-[#131314]/60'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[#1c1d1e] border border-[#2e3032] flex items-center justify-center text-zinc-400 group-hover:text-white">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Click to browse or drag & drop screenshot
                  </p>
                  <p className="text-xs text-[#9a9c9e] mt-1">
                    Or simply copy your Valoplant screenshot and press <kbd className="px-1.5 py-0.5 rounded bg-[#1c1d1e] border border-[#2e3032] text-zinc-300 font-mono text-[10px]">Ctrl+V</kbd> anywhere on this screen
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Supports PNG, JPG, WEBP (Max 25MB)
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <span className="px-4 py-2 rounded-full bg-[#202123] hover:bg-[#282a2c] text-white text-xs font-semibold border border-[#2e3032] transition-colors">
                    Browse File
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleScreenshotCapture();
                    }}
                    disabled={isScreenCapturing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1c1d1e] hover:bg-[#262729] text-zinc-300 text-xs font-semibold border border-[#2e3032] transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5 text-red-400" />
                    <span>{isScreenCapturing ? 'Capturing...' : 'Capture Window'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tactical Notes */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Tactical Notes & Lineup Instructions (Optional)
            </label>
            <textarea
              value={stratNotes}
              onChange={(e) => setStratNotes(e.target.value)}
              rows={4}
              placeholder="e.g. Sova Recon arrow off barrier drop at 1:40; Viper smokes heaven; Omen flashes short..."
              className="w-full bg-[#131314] text-white text-xs rounded-2xl p-4 border border-[#2e3032] focus:border-red-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setPreviewImage(null);
                setStratTitle('');
                setStratNotes('');
                setErrorMessage('');
              }}
              className="px-5 py-2.5 rounded-full bg-[#202123] hover:bg-[#282a2c] text-zinc-300 text-xs font-semibold transition-colors"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={isSaving || !previewImage}
              className="px-7 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Strategy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
