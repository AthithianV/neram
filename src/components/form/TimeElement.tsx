// components/form/TimeElement.tsx
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import dayjs from "dayjs";

const hours = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);
const minutes = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

export interface TimeElementProps {
  value: Date;
  setValue: (val: Date) => void;
}

const TimeElement = ({ value, setValue }: TimeElementProps) => {
  const [hour, setHour] = useState<string>(
    value.getHours().toString().padStart(2, "0")
  );
  const [minute, setMinute] = useState<string>(
    value.getMinutes().toString().padStart(2, "0")
  );
  const [period, setPeriod] = useState<string>(
    value.getHours() < 12 ? "am" : "pm"
  );

  // Update local state when value prop changes
  useEffect(() => {
    setHour(value.getHours().toString().padStart(2, "0"));
    setMinute(value.getMinutes().toString().padStart(2, "0"));
    setPeriod(value.getHours() < 12 ? "am" : "pm");
  }, [value]);

  // Update parent value only when local state changes
  useEffect(() => {
    const newHour =
      period === "pm" ? (Number(hour) % 12) + 12 : Number(hour) % 12;
    const newDate = dayjs(value)
      .hour(newHour)
      .minute(Number(minute))
      .second(0)
      .millisecond(0)
      .toDate();

    if (!dayjs(newDate).isSame(value)) {
      setValue(newDate);
    }
  }, [hour, minute, period]);

  const displayTime = `${hour}:${minute} ${period.toUpperCase()}`;

  const handleTimeSelect = (
    newHour: string,
    newMinute: string,
    newPeriod: string
  ) => {
    setHour(newHour);
    setMinute(newMinute);
    setPeriod(newPeriod);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          className="w-full justify-center font-normal"
        >
          {displayTime}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-4" align="center">
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-1">
            <div className="text-sm font-medium mb-2">Hour</div>
            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
              {hours.map((h) => (
                <Button
                  key={h}
                  type="button"
                  variant={hour === h ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTimeSelect(h, minute, period)}
                >
                  {h}
                </Button>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <div className="text-sm font-medium mb-2">Minute</div>
            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
              {minutes.map((m) => (
                <Button
                  key={m}
                  type="button"
                  variant={minute === m ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => handleTimeSelect(hour, m, period)}
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <div className="text-sm font-medium mb-2">AM/PM</div>
            <div className="space-y-1">
              <Button
                type="button"
                variant={period === "am" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTimeSelect(hour, minute, "am")}
              >
                AM
              </Button>
              <Button
                type="button"
                variant={period === "pm" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => handleTimeSelect(hour, minute, "pm")}
              >
                PM
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TimeElement;
