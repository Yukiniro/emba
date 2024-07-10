import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFileProps {
  id: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputFile(props: InputFileProps) {
  const { id = "picture", label, onChange } = props;
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label className="text-xl" htmlFor={id}>{label}</Label>
      <Input id={id} type="file" onChange={onChange} />
    </div>
  );
}
