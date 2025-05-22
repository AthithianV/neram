import { useEffect, useRef } from "react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

const ComboboxInput = ({
  label,
  value,
  setValue,
  options,
  placeholder,
  width,
}: {
  label: string;
  value: string;
  setValue: (val: string) => void;
  options: string[];
  placeholder: string;
  className?: string;
  width?: string;
}) => {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [dropdownWidth, setDropdownWidth] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    console.log(triggerRef);

    console.log(triggerRef.current);

    if (open && triggerRef.current) {
      setDropdownWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger className={cn(width)}>
        <button ref={triggerRef} className={"w-full"}>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="max-h-[200px] overflow-y-auto"
        style={{ width: dropdownWidth ?? "auto" }}
      >
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => setValue(option)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ComboboxInput;
