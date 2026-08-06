import { QRTypeForm } from './components/QRTypeForm';
import { QRDisplay } from './components/QRDisplay';
import { QRSettings } from './components/QRSettings';
import { QRHistory } from './components/QRHistory';
import { Separator } from './components/ui/Separator';
import { TooltipProvider } from './components/ui/Tooltip';
import { QrCode } from 'lucide-react';

export function App() {
  return (
    <TooltipProvider>
      <div className="flex min-h-screen flex-col">
        <header className="border-b">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              <h1 className="text-lg font-semibold">QR Code Generator</h1>
            </div>
            <a
              href="https://github.com/alex-pimentel/qrcode"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-5xl flex-1 gap-8 px-6 py-8">
          <aside className="flex w-64 shrink-0 flex-col gap-5 overflow-y-auto">
            <QRSettings />
            <Separator />
            <QRHistory />
          </aside>

          <div className="flex flex-1 flex-col gap-4">
            <QRTypeForm />
            <div className="flex flex-1 items-start justify-center pt-8">
              <QRDisplay />
            </div>
          </div>
        </main>

        <footer className="border-t py-4 text-center text-xs text-muted-foreground">
          MIT &copy; {new Date().getFullYear()} Alex Pimentel
        </footer>
      </div>
    </TooltipProvider>
  );
}
