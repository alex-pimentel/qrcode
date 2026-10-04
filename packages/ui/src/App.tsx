import { ServiceShell, UserButton } from '@agenteresolve/ui';
import { QRTypeForm } from './components/QRTypeForm';
import { QRDisplay } from './components/QRDisplay';
import { QRSettings } from './components/QRSettings';
import { QRHistory } from './components/QRHistory';
import { Separator } from './components/ui/Separator';
import { TooltipProvider } from './components/ui/Tooltip';

export function App() {
  return (
    <ServiceShell
      title="QR Code Generator"
      description="Create customizable QR codes for URLs, text, Wi-Fi, PIX, email and SMS."
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      authSlot={<UserButton />}
    >
      <TooltipProvider>
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="flex w-full shrink-0 flex-col gap-5 lg:w-64">
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
        </div>
      </TooltipProvider>
    </ServiceShell>
  );
}
