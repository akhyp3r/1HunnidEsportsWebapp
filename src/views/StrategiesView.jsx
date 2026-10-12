import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  MapPin, 
  Search, 
  Filter, 
  Trash2, 
  Calendar, 
  User, 
  Eye, 
  Download, 
  Plus, 
  X, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileImage
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { VALORANT_MAPS, getSitesForMap } from './ValoplantView';

export default function StrategiesView({ onNavigateToValoplant }) {
  const { user, isManager } = useAuth();
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [filterMap, setFilterMap] = useState('All');
  const [filterSite, setFilterSite] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Lightbox / Detail Modal
  const [activeStrat, setActiveStrat] = useState(null);

  // Delete confirm modal
  const [deletingStrat, setDeletingStrat] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      const res = await api.getStrategies();
      setStrategies(res.strategies || []);
    } catch (err) {
      console.error('Failed to load strategies:', err);
      setError('Failed to load strategies library.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const handleDelete = async () => {
    if (!deletingStrat) return;
    try {
      setIsDeleting(true);
      await api.deleteStrategy(deletingStrat.id);
      setStrategies(prev => prev.filter(s => s.id !== deletingStrat.id));
      if (activeStrat?.id === deletingStrat.id) {
        setActiveStrat(null);
      }
      setDeletingStrat(null);
    } catch (err) {
      alert(err.message || 'Failed to delete strategy');
    } finally {
      setIsDeleting(false);
    }
  };

  // Available site filter options based on selected map
  const siteFilterOptions = filterMap === 'All' 
    ? ['All', 'Default', 'A', 'B', 'C']
    : ['All', ...getSitesForMap(filterMap)];

  // Filtered strategies
  const filteredStrategies = strategies.filter(strat => {
    if (filterMap !== 'All' && strat.map.toLowerCase() !== filterMap.toLowerCase()) {
      return false;
    }
    if (filterSite !== 'All') {
      const target = filterSite.toLowerCase();
      const current = (strat.site || 'Default').toLowerCase();
      if (target === 'default' && current !== 'default') return false;
      if (target !== 'default' && current !== target) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = strat.title.toLowerCase().includes(q);
      const matchesNotes = (strat.notes || '').toLowerCase().includes(q);
      const matchesAuthor = (strat.authorName || '').toLowerCase().includes(q);
      if (!matchesTitle && !matchesNotes && !matchesAuthor) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
            <Layers className="w-4 h-4" />
            <span>Playbook Repository</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
            Team Strategies & Setups
          </h2>
          <p className="text-xs text-[#9a9c9e] mt-0.5">
            Archived Valoplant executes, site defaults, and setups saved by One Hunnid Esports.
          </p>
        </div>

        <button
          onClick={onNavigateToValoplant}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Strat on Valoplant</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#1c1d1e] border border-[#2e3032] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Map Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Map:</span>
            <select
              value={filterMap}
              onChange={(e) => {
                setFilterMap(e.target.value);
                setFilterSite('All'); // reset site filter when map changes
              }}
              className="bg-[#131314] text-white text-xs font-semibold rounded-xl px-3 py-1.5 border border-[#2e3032] focus:border-red-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All Maps ({strategies.length})</option>
              {VALORANT_MAPS.map(map => {
                const count = strategies.filter(s => s.map.toLowerCase() === map.toLowerCase()).length;
                return (
                  <option key={map} value={map}>
                    {map} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Site Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Site:</span>
            <select
              value={filterSite}
              onChange={(e) => setFilterSite(e.target.value)}
              className="bg-[#131314] text-white text-xs font-semibold rounded-xl px-3 py-1.5 border border-[#2e3032] focus:border-red-500 focus:outline-none cursor-pointer"
            >
              {siteFilterOptions.map(site => (
                <option key={site} value={site}>
                  {site === 'All' ? 'All Sites' : site === 'Default' ? 'Default' : `${site} Site`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-64 relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search strat title or author..."
            className="w-full bg-[#131314] text-white text-xs rounded-xl pl-9 pr-3 py-1.5 border border-[#2e3032] focus:border-red-500 focus:outline-none placeholder-zinc-500"
          />
        </div>
      </div>

      {/* Strategies Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 rounded-full border-2 border-red-500 border-t-transparent animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-zinc-500">Loading strategy library...</p>
        </div>
      ) : filteredStrategies.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#1c1d1e] border border-[#2e3032] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#131314] border border-[#2e3032] flex items-center justify-center mx-auto text-zinc-500">
            <FileImage className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No strategies found</h3>
            <p className="text-xs text-[#9a9c9e] max-w-md mx-auto mt-1">
              {strategies.length === 0
                ? 'No strategy screenshots have been saved yet. Go to the Valoplant board to capture or upload your team setups!'
                : 'No strategies match your current map, site, or search filter.'}
            </p>
          </div>
          <button
            onClick={onNavigateToValoplant}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#202123] hover:bg-[#282a2c] text-white text-xs font-semibold border border-[#2e3032] transition-colors"
          >
            <span>Open Valoplant Board</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStrategies.map((strat) => {
            const isHavenOrLotus = strat.map.toLowerCase() === 'haven' || strat.map.toLowerCase() === 'lotus';
            const siteLabel = strat.site === 'Default' ? 'Default' : `${strat.site} Site`;
            const canDelete = isManager || strat.authorId === user?.id;

            return (
              <div
                key={strat.id}
                className="group rounded-2xl bg-[#1c1d1e] border border-[#2e3032] hover:border-[#3e4043] transition-all overflow-hidden flex flex-col shadow-sm"
              >
                {/* Strat Screenshot Frame */}
                <div 
                  onClick={() => setActiveStrat(strat)}
                  className="relative aspect-video bg-[#131314] cursor-pointer overflow-hidden border-b border-[#262729] flex items-center justify-center"
                >
                  <img
                    src={strat.imageUrl}
                    alt={strat.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-[#1c1d1e]/90 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                      <Eye className="w-3.5 h-3.5 text-red-400" />
                      <span>View Fullscreen</span>
                    </span>
                  </div>

                  {/* Badges on preview image */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold border border-white/10">
                      {strat.map}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-red-600/80 backdrop-blur-sm text-white text-[10px] font-bold">
                      {siteLabel}
                    </span>
                  </div>
                </div>

                {/* Content body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => setActiveStrat(strat)}
                      className="text-sm font-bold text-white hover:text-red-400 cursor-pointer line-clamp-1 transition-colors"
                      title={strat.title}
                    >
                      {strat.title}
                    </h3>
                    {strat.notes ? (
                      <p className="text-xs text-[#9a9c9e] mt-1.5 line-clamp-2 leading-relaxed">
                        {strat.notes}
                      </p>
                    ) : (
                      <p className="text-[11px] text-zinc-600 italic mt-1">No additional notes provided</p>
                    )}
                  </div>

                  {/* Metadata and Actions */}
                  <div className="pt-3 mt-3 border-t border-[#262729] flex items-center justify-between text-[11px] text-zinc-400">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-zinc-500">By</span>
                      <span className="font-semibold text-zinc-300 truncate max-w-[100px]">
                        {strat.authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={strat.imageUrl}
                        download={`${strat.map}_${strat.site}_${strat.title}.png`}
                        className="p-1 rounded-full hover:bg-[#202123] text-zinc-400 hover:text-white transition-colors"
                        title="Download Image"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>

                      {canDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingStrat(strat);
                          }}
                          className="p-1 rounded-full hover:bg-red-950/40 text-zinc-500 hover:text-red-400 transition-colors"
                          title="Delete Strategy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {activeStrat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1c1d1e] border border-[#2e3032] rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 px-6 border-b border-[#262729] flex items-center justify-between bg-[#171819]">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-bold">
                  {activeStrat.map} • {activeStrat.site === 'Default' ? 'Default' : `${activeStrat.site} Site`}
                </span>
                <h3 className="text-sm md:text-base font-bold text-white truncate max-w-md">
                  {activeStrat.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeStrat.imageUrl}
                  download={`${activeStrat.map}_${activeStrat.title}.png`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#202123] hover:bg-[#282a2c] text-white text-xs font-semibold border border-[#2e3032] transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setActiveStrat(null)}
                  className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-[#262729] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image display */}
            <div className="flex-1 overflow-auto p-4 bg-[#0f1011] flex items-center justify-center min-h-[300px]">
              <img
                src={activeStrat.imageUrl}
                alt={activeStrat.title}
                className="max-h-[60vh] max-w-full object-contain rounded-xl shadow-lg border border-[#2e3032]"
              />
            </div>

            {/* Modal Notes Footer */}
            {activeStrat.notes && (
              <div className="p-5 border-t border-[#262729] bg-[#171819] space-y-1">
                <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Tactical Notes</div>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                  {activeStrat.notes}
                </p>
                <div className="text-[10px] text-zinc-500 pt-1">
                  Created by {activeStrat.authorName} on {new Date(activeStrat.createdAt).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingStrat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1c1d1e] border border-[#2e3032] rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Delete Strategy?</h3>
            <p className="text-xs text-[#9a9c9e] leading-relaxed">
              Are you sure you want to delete <strong className="text-white">{deletingStrat.title}</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingStrat(null)}
                className="px-4 py-2 rounded-full bg-[#202123] hover:bg-[#282a2c] text-zinc-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
