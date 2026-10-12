import React, { useState } from 'react';
import { 
  Crosshair, 
  ExternalLink, 
  AppWindow, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Copy, 
  Check, 
  ArrowRight,
  Globe
} from 'lucide-react';

export default function GanksterScrimsView() {
  const ganksterScrimsUrl = 'https://valorant.gankster.gg/scrims';
  const ganksterTourneysUrl = 'https://valorant.gankster.gg/tournaments';
  const [copiedLink, setCopiedLink] = useState(false);

  const openAppWindow = () => {
    const width = 1280;
    const height = 820;
    const left = Math.max(0, (window.screen.width - width) / 2);
    const top = Math.max(0, (window.screen.height - height) / 2);
    window.open(
      ganksterScrimsUrl,
      'GanksterScrimWindow',
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,resizable=yes`
    );
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(ganksterScrimsUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400">
            <Crosshair className="w-4 h-4" />
            <span>Competitive Matchmaking</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5">
            Gankster Valorant Scrims
          </h2>
          <p className="text-xs text-[#9a9c9e] mt-0.5">
            Official competitive matchmaking & practice lobby partner for One Hunnid Esports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openAppWindow}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#202123] hover:bg-[#282a2c] text-white text-xs font-semibold border border-[#2e3032] transition-colors shadow-sm"
            title="Open in a clean standalone pop-out window"
          >
            <AppWindow className="w-3.5 h-3.5 text-zinc-400" />
            <span>Pop-Out Window</span>
          </button>

          <a
            href={ganksterScrimsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Open Gankster</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Gankster Launch Center Card */}
      <div className="p-7 md:p-8 rounded-3xl bg-[#1c1d1e] border border-[#2e3032] space-y-6 relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#262729]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#131314] border border-[#2e3032] p-2 flex items-center justify-center flex-shrink-0">
              <Crosshair className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Gankster.gg Scrim Finder</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20">
                  Online Lobby
                </span>
              </div>
              <p className="text-xs text-[#9a9c9e] mt-1 leading-relaxed max-w-lg">
                Gankster is the industry-standard scrim matchmaking platform. Due to Gankster's security policy (<code className="text-zinc-400 font-mono">X-Frame-Options</code>), authentication and match coordination run directly in its dedicated window.
              </p>
            </div>
          </div>

          {/* Large Launch Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={openAppWindow}
              className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Launch Scrim Finder</span>
            </button>

            <button
              onClick={copyUrl}
              className="px-4 py-3 rounded-full bg-[#131314] hover:bg-[#202123] text-zinc-300 hover:text-white text-xs font-semibold border border-[#2e3032] transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied Link' : 'Copy URL'}</span>
            </button>
          </div>
        </div>

        {/* 3 Step Workflow for Team Scrims */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
            How One Hunnid Coordinates Scrims with Gankster
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#131314] border border-[#262729] space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                Step 1
              </div>
              <div className="text-xs font-bold text-white">Find or Post a Scrim</div>
              <p className="text-[11px] text-[#9a9c9e] leading-relaxed">
                Open Gankster to filter available opponent teams by server region (Singapore / Tokyo / EU / NA) and competitive rank.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#131314] border border-[#262729] space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                Step 2
              </div>
              <div className="text-xs font-bold text-white">Agree on Match Format</div>
              <p className="text-[11px] text-[#9a9c9e] leading-relaxed">
                Lock in match time, format (Bo2/Bo3), map vetoes, and custom tournament server rules with the opposing team captain.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#131314] border border-[#262729] space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-red-400">
                Step 3
              </div>
              <div className="text-xs font-bold text-white">Announce to One Hunnid</div>
              <p className="text-[11px] text-[#9a9c9e] leading-relaxed">
                Post the confirmed schedule in the <strong>Scrim Schedules</strong> tab so players get notified and RSVP on their portal!
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links Cards */}
        <div className="pt-2 border-t border-[#262729] grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={ganksterScrimsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#131314] border border-[#262729] hover:border-[#3e4043] flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-3">
              <Crosshair className="w-4 h-4 text-red-400" />
              <div>
                <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                  Valorant Scrim Matchmaking
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  valorant.gankster.gg/scrims
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </a>

          <a
            href={ganksterTourneysUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#131314] border border-[#262729] hover:border-[#3e4043] flex items-center justify-between group transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                  Gankster Community Tournaments
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  valorant.gankster.gg/tournaments
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
          </a>
        </div>
      </div>
    </div>
  );
}
