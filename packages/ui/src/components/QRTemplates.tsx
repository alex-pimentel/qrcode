import { QR_TEMPLATES } from '@qrcode/core';
import { useQRStore } from '../store';
import { Button } from './ui/Button';

export function QRTemplates() {
  const applyTemplate = useQRStore((s) => s.applyTemplate);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium">Templates</span>
      <div className="grid grid-cols-2 gap-2">
        {QR_TEMPLATES.map((tpl) => (
          <Button
            key={tpl.id}
            variant="outline"
            size="sm"
            onClick={() => applyTemplate(tpl.foreground, tpl.background)}
            className="h-auto justify-start gap-2 py-2"
          >
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border text-[8px] font-bold"
              style={{ backgroundColor: tpl.background, color: tpl.foreground }}
            >
              QR
            </span>
            <span className="truncate text-xs">{tpl.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
