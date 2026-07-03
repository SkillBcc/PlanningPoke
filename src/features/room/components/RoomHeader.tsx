import React from 'react';
import { Copy, Check, Timer, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { RoomState } from '../../../core/services/WebSocketService';
import logoImage from '../../../assets/images/planning_poker_white_p_logo_1782837649464.jpg';

interface RoomHeaderProps {
  roomState: RoomState;
  isOwner: boolean;
  copied: boolean;
  timeLeft: string;
  onCopyLink: () => void;
  actions: any;
}

export const RoomHeader = ({ roomState, isOwner, copied, timeLeft, onCopyLink, actions }: RoomHeaderProps) => {
  const activeTask = roomState?.tasks?.find(t => t.id === roomState.activeTaskId);
  const isRevealed = activeTask?.isRevealed ?? false;
  const onlineVotingUsersForReveal = roomState?.users.filter(u => u.isOnline && !u.isSpectator) || [];
  const allVoted = onlineVotingUsersForReveal.length > 0 && onlineVotingUsersForReveal.every(u => u.hasVoted);

  const timerSeconds = roomState?.timerSeconds ?? 120;
  const timerIsRunning = roomState?.timerIsRunning ?? false;
  const timerDuration = roomState?.timerDuration ?? 120;

  const handleReveal = () => {
    if (!roomState.activeTaskId) return;
    if (isRevealed) {
      if (activeTask?.finalEstimate) return;
      actions.reveal(); // Actually acts as Reset Board because it toggles, but here we can just pass down actions.reveal
    } else {
      actions.reveal();
    }
  };

  return (
    <header className="h-20 shrink-0 border-b border-zinc-800 bg-[#0E0E10] px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <img 
            src={logoImage} 
            alt="Planning Poker Logo" 
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-lg object-cover shadow-lg border border-zinc-700/50"
          />
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              planpoker.tech
              <span className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-800">Room</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-zinc-500 font-mono select-all">
                {roomState.id}
              </span>
              <button 
                onClick={onCopyLink}
                className="text-zinc-500 hover:text-indigo-400 transition-colors flex items-center gap-1 group cursor-pointer"
                title="Copy invite link"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 group-hover:scale-110 transition-transform" />}
                <span className="text-[9px] font-semibold uppercase tracking-wider">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
        {timeLeft && (
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md ml-2">
            <Timer className={`w-3.5 h-3.5 ${timeLeft === 'Expired' ? 'text-rose-500' : 'text-zinc-400'}`} />
            <span className={`text-[10px] font-bold ${timeLeft === 'Expired' ? 'text-rose-500' : 'text-zinc-300'}`}>
              {timeLeft}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Timer Control (Owner Only) / Display (All) */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md min-w-[140px]">
          <Timer className={`w-4 h-4 ${timerIsRunning ? 'text-indigo-400 animate-pulse' : 'text-zinc-500'}`} />
          <span className={`text-sm font-mono font-bold w-12 text-center tabular-nums ${timerSeconds <= 10 && timerSeconds > 0 ? 'text-rose-400' : 'text-zinc-300'}`}>
            {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
          </span>
          
          {isOwner && (
            <>
              <div className="w-px h-4 bg-zinc-800 mx-1"></div>
              <div className="flex items-center gap-0.5">
                {!timerIsRunning ? (
                  <button onClick={() => actions.startTimer()} className="p-1 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded cursor-pointer">
                    <Play className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button onClick={() => actions.pauseTimer()} className="p-1 text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 rounded cursor-pointer">
                    <Pause className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => actions.resetTimer()} className="p-1 text-zinc-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded cursor-pointer">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1 ml-1 pl-2 border-l border-zinc-800">
                {[60, 120, 300].map(secs => (
                  <button 
                    key={secs}
                    onClick={() => actions.setTimerDuration(secs)}
                    className={`text-[9px] font-bold px-1 py-0.5 rounded transition-colors cursor-pointer ${
                      timerDuration === secs 
                        ? 'bg-indigo-500/20 text-indigo-400' 
                        : 'text-zinc-600 hover:text-zinc-400'
                    }`}
                    title={`Set to ${secs / 60} min`}
                  >
                    {secs / 60}m
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {isOwner && (
          <button 
            onClick={handleReveal}
            disabled={!roomState.activeTaskId || (isRevealed && Boolean(activeTask?.finalEstimate))}
            className={`px-5 py-2 rounded-md font-medium transition-all duration-300 relative ${
              !roomState.activeTaskId
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : isRevealed 
                  ? (activeTask?.finalEstimate 
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed font-semibold' 
                      : 'bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer') 
                  : allVoted
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105 cursor-pointer'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
            }`}
          >
            {allVoted && !isRevealed && roomState.activeTaskId && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#0E0E10]"></span>
              </span>
            )}
            {isRevealed ? 'Reset Board' : 'Reveal Cards'}
          </button>
        )}
      </div>
    </header>
  );
};
