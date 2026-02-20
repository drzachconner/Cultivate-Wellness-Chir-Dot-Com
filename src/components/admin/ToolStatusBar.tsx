import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Terminal, ChevronDown, ChevronRight } from 'lucide-react';
import { TOOL_META } from './constants';
import type { ToolStatus } from './types';

interface ToolStatusBarProps {
  tools: ToolStatus[];
  autoCollapse?: boolean;
}

export function ToolStatusBar({ tools, autoCollapse = false }: ToolStatusBarProps) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (autoCollapse) setCollapsed(true);
  }, [autoCollapse]);

  if (tools.length === 0) return null;

  const runningCount = tools.filter((t) => t.status === 'running').length;
  const doneCount = tools.filter((t) => t.status === 'done').length;
  const errorCount = tools.filter((t) => t.status === 'error').length;

  const summaryText = runningCount > 0
    ? `Working... (${runningCount} active)`
    : `${doneCount} action${doneCount !== 1 ? 's' : ''} completed${errorCount ? `, ${errorCount} error${errorCount !== 1 ? 's' : ''}` : ''}`;

  return (
    <div className="mt-2">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {summaryText}
      </button>
      {!collapsed && (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {tools.map((t) => {
            const meta = TOOL_META[t.tool] || { label: t.tool, icon: Terminal };
            const Icon = meta.icon;
            const detail =
              t.input && 'path' in t.input
                ? String(t.input.path).split('/').pop()
                : t.input && 'command' in t.input
                  ? String(t.input.command).substring(0, 30)
                  : '';

            return (
              <span
                key={t.toolUseId}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono whitespace-nowrap ${
                  t.status === 'running'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : t.status === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                }`}
              >
                {t.status === 'running' ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : t.status === 'done' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <Icon className="w-3 h-3" />
                )}
                {meta.label}
                {detail && <span className="opacity-60 ml-0.5">{detail}</span>}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
