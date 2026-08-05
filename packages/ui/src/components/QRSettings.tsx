import { useQRStore } from '../store';
import type { QRSettings as QRSettingsType, QROutputFormat } from '@qrcode/core';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/Select';
import { Button } from './ui/Button';
import { QRTemplates } from './QRTemplates';
import { RefreshCw } from 'lucide-react';

const ERROR_LEVELS: { value: QRSettingsType['errorCorrectionLevel']; label: string }[] = [
  { value: 'L', label: 'Low (7%)' },
  { value: 'M', label: 'Medium (15%)' },
  { value: 'Q', label: 'Quartile (25%)' },
  { value: 'H', label: 'High (30%)' },
];

export function QRSettings() {
  const settings = useQRStore((s) => s.settings);
  const outputFormat = useQRStore((s) => s.outputFormat);
  const setWidth = useQRStore((s) => s.setWidth);
  const setMargin = useQRStore((s) => s.setMargin);
  const setForeground = useQRStore((s) => s.setForeground);
  const setBackground = useQRStore((s) => s.setBackground);
  const setErrorCorrectionLevel = useQRStore((s) => s.setErrorCorrectionLevel);
  const setOutputFormat = useQRStore((s) => s.setOutputFormat);
  const generate = useQRStore((s) => s.generate);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="qr-width">Size (px)</Label>
          <Input
            id="qr-width"
            type="number"
            min={100}
            max={600}
            value={settings.width}
            onChange={(e) => setWidth(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="qr-margin">Margin</Label>
          <Input
            id="qr-margin"
            type="number"
            min={0}
            max={10}
            value={settings.margin}
            onChange={(e) => setMargin(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="qr-fg">Foreground</Label>
          <div className="flex gap-2">
            <div
              className="h-9 w-9 rounded-md border shadow-sm"
              style={{ backgroundColor: settings.foreground }}
            />
            <Input
              id="qr-fg"
              type="color"
              value={settings.foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="h-9 w-full cursor-pointer px-1"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="qr-bg">Background</Label>
          <div className="flex gap-2">
            <div
              className="h-9 w-9 rounded-md border shadow-sm"
              style={{ backgroundColor: settings.background }}
            />
            <Input
              id="qr-bg"
              type="color"
              value={settings.background}
              onChange={(e) => setBackground(e.target.value)}
              className="h-9 w-full cursor-pointer px-1"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Error Correction</Label>
          <Select
            value={settings.errorCorrectionLevel}
            onValueChange={(v) =>
              setErrorCorrectionLevel(v as QRSettingsType['errorCorrectionLevel'])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ERROR_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Output Format</Label>
          <Select value={outputFormat} onValueChange={(v) => setOutputFormat(v as QROutputFormat)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="png">PNG (raster)</SelectItem>
              <SelectItem value="svg">SVG (vector)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <QRTemplates />

      <Button variant="secondary" onClick={generate} disabled={!settings.text.trim()}>
        <RefreshCw />
        Regenerate
      </Button>
    </div>
  );
}
