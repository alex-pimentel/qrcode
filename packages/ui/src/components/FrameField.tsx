import type { QRFrameThickness, QRFrameType } from '@qrcode/core';
import { useQRStore } from '../store';
import { ColorField } from './ColorField';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';

export function FrameField() {
  const frame = useQRStore((s) => s.settings.frame);
  const setFrame = useQRStore((s) => s.setFrame);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Frame</Label>
        <Select value={frame.type} onValueChange={(v) => setFrame({ type: v as QRFrameType })}>
          <SelectTrigger aria-label="Frame">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="solid">Solid</SelectItem>
            <SelectItem value="corners">Decorative corners</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {frame.type !== 'none' && (
        <>
          <ColorField
            id="qr-frame-color"
            label="Frame color"
            value={frame.color}
            onChange={(color) => setFrame({ color })}
          />

          <div className="flex flex-col gap-1.5">
            <Label>Thickness</Label>
            <Select
              value={frame.thickness}
              onValueChange={(v) => setFrame({ thickness: v as QRFrameThickness })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thin">Thin</SelectItem>
                <SelectItem value="thick">Thick</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="qr-frame-caption">Caption</Label>
            <Input
              id="qr-frame-caption"
              value={frame.caption}
              placeholder="e.g. Scan me"
              onChange={(e) => setFrame({ caption: e.target.value })}
            />
          </div>
        </>
      )}
    </div>
  );
}
