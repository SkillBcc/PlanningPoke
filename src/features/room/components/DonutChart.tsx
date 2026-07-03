import React from 'react';

export const PALETTE = [
  '#818cf8', // Matte Indigo
  '#34d399', // Matte Emerald
  '#c084fc', // Matte Purple
  '#fbbf24', // Matte Amber
  '#60a5fa', // Matte Blue
  '#fb7185', // Matte Rose
  '#22d3ee', // Matte Cyan
  '#a1a1aa'  // Matte Zinc
];

export const DonutChart = ({ voteCounts }: { voteCounts: Record<string, number> }) => {
  const sortedVotes = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
  const total = sortedVotes.reduce((sum, [_, count]) => sum + count, 0);

  if (total === 0) {
    return (
      <div className="w-20 h-20 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center text-[10px] text-zinc-500 font-medium">
        Empty
      </div>
    );
  }

  const circumference = 2 * Math.PI * 30; // ~188.496
  let accumulatedPercent = 0;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center group" data-testid="donut-chart">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {sortedVotes.map(([val, count], index) => {
          const percent = count / total;
          const strokeLength = percent * circumference;
          const strokeOffset = -accumulatedPercent * circumference;
          accumulatedPercent += percent;

          const color = PALETTE[index % PALETTE.length];

          return (
            <circle
              key={val}
              cx="50"
              cy="50"
              r="30"
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={`${strokeLength} ${circumference}`}
              strokeDashoffset={strokeOffset}
              className="transition-all duration-300 hover:stroke-[12] cursor-pointer"
            >
              <title>{`${val}: ${count} ${count === 1 ? 'vote' : 'votes'} (${Math.round(percent * 100)}%)`}</title>
            </circle>
          );
        })}
      </svg>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <span className="text-[10px] font-extrabold text-white leading-none">{total}</span>
        <span className="text-[7px] text-zinc-500 uppercase tracking-widest mt-0.5">{total === 1 ? 'vote' : 'votes'}</span>
      </div>
    </div>
  );
};
