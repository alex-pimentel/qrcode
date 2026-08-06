import type { QROutputFormat } from '@qrcode/core';
import type { QRSettings as QRSettingsType } from '@qrcode/core';
import { canGeneratePayload } from '@qrcode/core';
import { useQRStore } from '../store';
import { ColorField } from './ColorField';
import { FrameField } from './FrameField';
import { QRTemplates } from './QRTemplates';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
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

        <ColorField
          id="qr-fg"
          label="Foreground"
          value={settings.foreground}
          onChange={setForeground}
        />

        <ColorField
          id="qr-bg"
          label="Background"
          value={settings.background}
          onChange={setBackground}
        />

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

      <FrameField />

      <QRTemplates />

      <Button variant="secondary" onClick={generate} disabled={!canGeneratePayload(settings)}>
        <RefreshCw />
        Regenerate
      </Button>
    </div>
  );
}
