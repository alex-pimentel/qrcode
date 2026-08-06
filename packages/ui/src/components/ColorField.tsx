import { HexColorPicker } from 'react-colorful';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Popover, PopoverContent, PopoverTrigger } from './ui/Popover';

interface ColorFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function normalize(value: string): string {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : '#000000';
}

export function ColorField({ id, label, value, onChange }: ColorFieldProps) {
  const color = normalize(value);
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-9 w-full justify-start gap-2 px-3"
            aria-label={label}
          >
            <span
              className="h-5 w-5 shrink-0 rounded-sm border shadow-sm"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono text-xs text-muted-foreground">{color.toUpperCase()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="flex flex-col gap-3">
            <HexColorPicker color={color} onChange={onChange} />
            <div className="flex items-center gap-2">
              <Label htmlFor={id} className="text-xs text-muted-foreground">
                HEX
              </Label>
              <Input
                id={id}
                value={value}
                maxLength={7}
                className="h-8 font-mono text-xs"
                onChange={(e) => {
                  const next = e.target.value;
                  if (/^#[0-9a-fA-F]{0,6}$/.test(next)) onChange(next);
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
