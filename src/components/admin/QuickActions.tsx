import { QUICK_ACTIONS } from './constants';

interface QuickActionsProps {
  onAction: (text: string) => void;
  visible: boolean;
}

export function QuickActions({ onAction, visible }: QuickActionsProps) {
  if (!visible) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 pb-2">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action}
          onClick={() => onAction(action)}
          className="px-3 py-1.5 text-xs bg-primary/10 text-primary-dark rounded-full hover:bg-primary/20 transition-colors whitespace-nowrap"
        >
          {action}
        </button>
      ))}
    </div>
  );
}
