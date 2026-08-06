import { useQRStore } from '../store';
import { Button } from './ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/Tooltip';
import { Download, Copy, QrCode } from 'lucide-react';

export function QRDisplay() {
  const qrDataURL = useQRStore((s) => s.qrDataURL);
  const qrSVG = useQRStore((s) => s.qrSVG);
  const outputFormat = useQRStore((s) => s.outputFormat);
  const error = useQRStore((s) => s.error);
  const download = useQRStore((s) => s.download);
  const copyImage = useQRStore((s) => s.copyImage);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/50 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  if (!qrDataURL) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-16 text-center">
        <QrCode className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Fill in the fields and click Generate to create a QR code
        </p>
      </div>
    );
  }

  const downloadLabel = outputFormat === 'svg' ? 'Download SVG' : 'Download PNG';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        {outputFormat === 'svg' && qrSVG ? (
          <div className="max-h-[400px] max-w-full" dangerouslySetInnerHTML={{ __html: qrSVG }} />
        ) : (
          <img src={qrDataURL} alt="QR Code" className="max-h-[400px] max-w-full object-contain" />
        )}
      </div>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={download}>
              <Download />
              {downloadLabel}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download as {outputFormat.toUpperCase()}</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={copyImage}>
              <Copy />
              Copy
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy image to clipboard</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
