import { useQRStore } from '../store';
import { Button } from './ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/Tooltip';
import { Trash2, Clock, ExternalLink } from 'lucide-react';

export function QRHistory() {
  const history = useQRStore((s) => s.history);
  const loadHistoryEntry = useQRStore((s) => s.loadHistoryEntry);
  const removeHistory = useQRStore((s) => s.removeHistory);
  const clearHistory = useQRStore((s) => s.clearHistory);

  if (history.length === 0) {
    return (
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium">History</span>
        <p className="text-xs text-muted-foreground">No QR codes generated yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">History</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="h-6 text-xs text-muted-foreground hover:text-destructive"
        >
          Clear all
        </Button>
      </div>
      <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="group flex items-center gap-2 rounded-md border px-2 py-1.5 hover:bg-accent"
          >
            <img src={entry.dataURL} alt="" className="h-8 w-8 rounded-sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{entry.label}</p>
              <p className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="h-2.5 w-2.5" />
                {formatTime(entry.timestamp)}
              </p>
            </div>
            <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => loadHistoryEntry(entry)}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Load</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive"
                    onClick={() => removeHistory(entry.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - ts;

  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString();
}
