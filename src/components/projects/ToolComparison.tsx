import type { ToolReference, ToolCheckResult } from '@/types';
import StatusDot from '@/components/ui/StatusDot';

interface ToolComparisonProps {
  patternTools: ToolReference[];
  myTools: ToolReference[];
  checkResults?: ToolCheckResult[];
}

function ToolRow({ tool, checkResult }: { tool: ToolReference; checkResult?: ToolCheckResult }) {
  return (
    <div className="flex items-center gap-3 py-2 border-t border-linen-100 first:border-t-0">
      <div className="flex-1 min-w-0">
        <span className="text-sm text-linen-900">
          {tool.category} · {tool.size}
          {tool.needleLength && ` · ${tool.needleLength}`}
        </span>
        {tool.notes && (
          <p className="text-xs text-linen-400 truncate">{tool.notes}</p>
        )}
        {tool.brand && (
          <p className="text-xs text-linen-400">{tool.brand}</p>
        )}
      </div>
      {checkResult && <StatusDot status={checkResult.status} />}
    </div>
  );
}

export default function ToolComparison({ patternTools, myTools, checkResults }: ToolComparisonProps) {
  if (patternTools.length === 0 && myTools.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-linen-100 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-linen-700 mb-3 flex items-center gap-1.5">
        <span>🪡</span> 도구 비교
      </h3>

      {patternTools.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-linen-400 mb-1">권장 도구</p>
          <div>
            {patternTools.map((tool, i) => (
              <ToolRow
                key={i}
                tool={tool}
                checkResult={checkResults?.[i]}
              />
            ))}
          </div>
        </div>
      )}

      {myTools.length > 0 && (
        <div>
          <p className="text-xs font-medium text-linen-400 mb-1">실제 사용한 도구</p>
          <div>
            {myTools.map((tool, i) => (
              <ToolRow key={i} tool={tool} />
            ))}
          </div>
        </div>
      )}

      {myTools.length === 0 && patternTools.length > 0 && (
        <p className="text-xs text-linen-300 mt-1">실제 사용 도구 미입력</p>
      )}
    </div>
  );
}
