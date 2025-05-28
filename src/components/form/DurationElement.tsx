import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const DurationElement = ({
  value,
  setValue,
}: {
  value: number;
  setValue: (value: number) => void;
}) => {
  const [hours, setHours] = useState(
    Math.floor(value / 3600)
      .toString()
      .padStart(2, "0")
  );
  const [minutes, setMinutes] = useState(
    Math.floor((value % 3600) / 60)
      .toString()
      .padStart(2, "0")
  );

  useEffect(() => {
    const totalSeconds =
      (Number(hours) || 0) * 3600 + (Number(minutes) || 0) * 60;
    setValue(totalSeconds);
  }, [hours, minutes, setValue]);

  return (
    <div className="flex items-center gap-1 justify-end">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-center font-normal"
          >
            {`${hours}:${minutes}`}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[250px] p-4 flex items-center gap-2"
          align="center"
          side="top"
        >
          <div className="flex items-center gap-2 flex-col">
            <span className="text-sm font-medium">Hours</span>
            <Input
              type="number"
              name="hours"
              value={hours}
              className="text-center"
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 flex-col">
            <span className="text-sm font-medium">Minutes</span>
            <Input
              type="number"
              name="minutes"
              value={minutes}
              className="text-center"
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DurationElement;
