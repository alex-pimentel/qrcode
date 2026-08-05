import { useCallback, useEffect, useRef, type KeyboardEvent } from 'react';
import { useQRStore } from '../store';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { QrCode, Loader2 } from 'lucide-react';

export function QRForm() {
  const text = useQRStore((s) => s.settings.text);
  const generating = useQRStore((s) => s.generating);
  const setText = useQRStore((s) => s.setText);
  const generate = useQRStore((s) => s.generate);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = useCallback(() => {
    if (text.trim()) {
      generate();
    }
  }, [text, generate]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleGenerate();
      }
    },
    [handleGenerate],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex gap-2">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Enter URL or text..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button onClick={handleGenerate} disabled={generating || !text.trim()}>
        {generating ? <Loader2 className="animate-spin" /> : <QrCode />}
        Generate
      </Button>
    </div>
  );
}
