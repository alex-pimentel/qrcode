import type { QRType, WifiSecurity } from '@qrcode/core';
import { canGeneratePayload, QR_TYPES } from '@qrcode/core';
import { Banknote, Globe, Loader2, Mail, MessageSquare, QrCode, Type, Wifi } from 'lucide-react';
import { useQRStore } from '../store';
import { cn } from './ui/cn';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';

const TYPE_ICONS: Record<QRType, typeof Type> = {
  text: Type,
  url: Globe,
  wifi: Wifi,
  pix: Banknote,
  email: Mail,
  sms: MessageSquare,
};

export function QRTypeForm() {
  const settings = useQRStore((s) => s.settings);
  const generating = useQRStore((s) => s.generating);
  const setType = useQRStore((s) => s.setType);
  const setText = useQRStore((s) => s.setText);
  const setUrl = useQRStore((s) => s.setUrl);
  const setWifi = useQRStore((s) => s.setWifi);
  const setPix = useQRStore((s) => s.setPix);
  const setEmail = useQRStore((s) => s.setEmail);
  const setSms = useQRStore((s) => s.setSms);
  const generate = useQRStore((s) => s.generate);

  const { type } = settings;

  const canGenerate = canGeneratePayload(settings);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1 rounded-md border bg-muted/50 p-1">
        {QR_TYPES.map((t) => {
          const Icon = TYPE_ICONS[t.value];
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition-colors',
                type === t.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {type === 'text' && (
        <Field label="Text">
          <Input
            id="qr-text"
            placeholder="Enter text..."
            value={settings.text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canGenerate && generate()}
          />
        </Field>
      )}

      {type === 'url' && (
        <Field label="URL">
          <Input
            id="qr-url"
            type="url"
            placeholder="Enter URL..."
            value={settings.url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && canGenerate && generate()}
          />
        </Field>
      )}

      {type === 'wifi' && (
        <>
          <Field label="Network name (SSID)">
            <Input
              id="qr-wifi-ssid"
              placeholder="MyNetwork"
              value={settings.wifi.ssid}
              onChange={(e) => setWifi({ ssid: e.target.value })}
            />
          </Field>
          <Field label="Password">
            <Input
              id="qr-wifi-password"
              type="password"
              placeholder="••••••••"
              disabled={settings.wifi.security === 'nopass'}
              value={settings.wifi.password}
              onChange={(e) => setWifi({ password: e.target.value })}
            />
          </Field>
          <Field label="Security">
            <Select
              value={settings.wifi.security}
              onValueChange={(v) => setWifi({ security: v as WifiSecurity })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
                <SelectItem value="WEP">WEP</SelectItem>
                <SelectItem value="nopass">None (open)</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={settings.wifi.hidden}
              onChange={(e) => setWifi({ hidden: e.target.checked })}
              className="h-4 w-4 rounded border-input accent-foreground"
            />
            Hidden network
          </label>
        </>
      )}

      {type === 'pix' && (
        <>
          <Field label="PIX key">
            <Input
              id="qr-pix-key"
              placeholder="CPF, email, phone or random key"
              value={settings.pix.key}
              onChange={(e) => setPix({ key: e.target.value })}
            />
          </Field>
          <Field label="Amount (optional)">
            <Input
              id="qr-pix-amount"
              inputMode="decimal"
              placeholder="e.g. 12.50"
              value={settings.pix.amount}
              onChange={(e) => setPix({ amount: e.target.value })}
            />
          </Field>
          <Field label="Receiver name">
            <Input
              id="qr-pix-name"
              placeholder="e.g. Fulano de Tal"
              value={settings.pix.name}
              onChange={(e) => setPix({ name: e.target.value })}
            />
          </Field>
          <Field label="City">
            <Input
              id="qr-pix-city"
              placeholder="e.g. SAO PAULO"
              value={settings.pix.city}
              onChange={(e) => setPix({ city: e.target.value })}
            />
          </Field>
          <Field label="Transaction ID (optional)">
            <Input
              id="qr-pix-txid"
              placeholder="e.g. order-123"
              value={settings.pix.txid}
              onChange={(e) => setPix({ txid: e.target.value })}
            />
          </Field>
        </>
      )}

      {type === 'email' && (
        <>
          <Field label="To">
            <Input
              id="qr-email-to"
              type="email"
              placeholder="name@example.com"
              value={settings.email.to}
              onChange={(e) => setEmail({ to: e.target.value })}
            />
          </Field>
          <Field label="Subject (optional)">
            <Input
              id="qr-email-subject"
              placeholder="Subject"
              value={settings.email.subject}
              onChange={(e) => setEmail({ subject: e.target.value })}
            />
          </Field>
          <Field label="Body (optional)">
            <textarea
              id="qr-email-body"
              rows={3}
              placeholder="Message"
              value={settings.email.body}
              onChange={(e) => setEmail({ body: e.target.value })}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </Field>
        </>
      )}

      {type === 'sms' && (
        <>
          <Field label="Phone number">
            <Input
              id="qr-sms-number"
              placeholder="+55 11 99999-9999"
              value={settings.sms.number}
              onChange={(e) => setSms({ number: e.target.value })}
            />
          </Field>
          <Field label="Message (optional)">
            <textarea
              id="qr-sms-message"
              rows={3}
              placeholder="Message"
              value={settings.sms.message}
              onChange={(e) => setSms({ message: e.target.value })}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </Field>
        </>
      )}

      <Button onClick={generate} disabled={generating || !canGenerate}>
        {generating ? <Loader2 className="animate-spin" /> : <QrCode />}
        Generate
      </Button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
