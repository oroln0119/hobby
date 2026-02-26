import type { Gauge } from '@/types';

interface GaugeComparisonProps {
  patternGauge?: Gauge;
  myGauge?: Gauge;
}

function GaugeBlock({ gauge, label }: { gauge: Gauge; label: string }) {
  return (
    <div className="flex-1 p-3 bg-linen-50 rounded-xl">
      <p className="text-xs font-medium text-linen-400 mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-linen-600">코</span>
          <span className="text-sm font-semibold text-linen-900">{gauge.stitches}/10cm</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-linen-600">단</span>
          <span className="text-sm font-semibold text-linen-900">{gauge.rows}/10cm</span>
        </div>
        {gauge.needleSize && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-linen-600">바늘</span>
            <span className="text-sm font-semibold text-oat-500">{gauge.needleSize}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GaugeDiff({ patternGauge, myGauge }: { patternGauge: Gauge; myGauge: Gauge }) {
  const stitchDiff = myGauge.stitches - patternGauge.stitches;
  const rowDiff = myGauge.rows - patternGauge.rows;

  if (stitchDiff === 0 && rowDiff === 0) {
    return (
      <p className="text-xs text-center text-sage-600 font-medium mt-2">
        ✓ 권장 게이지와 일치해요
      </p>
    );
  }

  return (
    <p className="text-xs text-center text-linen-500 mt-2">
      코 {stitchDiff > 0 ? `+${stitchDiff}` : stitchDiff} · 단 {rowDiff > 0 ? `+${rowDiff}` : rowDiff} 차이
    </p>
  );
}

export default function GaugeComparison({ patternGauge, myGauge }: GaugeComparisonProps) {
  if (!patternGauge && !myGauge) return null;

  return (
    <div className="bg-white rounded-2xl border border-linen-100 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-linen-700 mb-3 flex items-center gap-1.5">
        <span>📏</span> 게이지 비교
      </h3>
      <div className="flex gap-2">
        {patternGauge ? (
          <GaugeBlock gauge={patternGauge} label="권장 게이지" />
        ) : (
          <div className="flex-1 p-3 bg-linen-50 rounded-xl">
            <p className="text-xs text-linen-400">권장 게이지 미입력</p>
          </div>
        )}
        {myGauge ? (
          <GaugeBlock gauge={myGauge} label="내 게이지" />
        ) : (
          <div className="flex-1 p-3 bg-linen-50 rounded-xl flex items-center justify-center">
            <p className="text-xs text-linen-300">미입력</p>
          </div>
        )}
      </div>
      {patternGauge && myGauge && (
        <GaugeDiff patternGauge={patternGauge} myGauge={myGauge} />
      )}
    </div>
  );
}
