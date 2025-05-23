import { useEffect, useState } from "react";
import ComboboxInput from "./ComboxInput";
import dayjs from "dayjs";

const TimeElement = ({
  value,
  setValue,
}: {
  value: Date;
  setValue: (val: Date) => void;
}) => {
  const [hour, setHour] = useState<string>(
    value.getHours().toString().padStart(2, "0")
  );
  const [minute, setMinute] = useState<string>(
    value.getMinutes().toString().padStart(2, "0")
  );
  const [ampm, setAmpm] = useState<string>(value.getHours() < 12 ? "am" : "pm");

  // Update local state when value prop changes
  useEffect(() => {
    setHour(value.getHours().toString().padStart(2, "0"));
    setMinute(value.getMinutes().toString().padStart(2, "0"));
    setAmpm(value.getHours() < 12 ? "am" : "pm");
  }, [value]);

  // Update parent value only when local state changes
  useEffect(() => {
    const newHour =
      ampm === "pm" ? (Number(hour) % 12) + 12 : Number(hour) % 12;
    const newDate = dayjs(value)
      .hour(newHour)
      .minute(Number(minute))
      .second(0)
      .millisecond(0)
      .toDate();

    if (!dayjs(newDate).isSame(value)) {
      setValue(newDate);
    }
  }, [hour, minute, ampm]);

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  return (
    <div className="flex items-center gap-2">
      <ComboboxInput
        label="Hour"
        value={hour}
        setValue={setHour}
        options={hours}
        placeholder="HH"
        width={"w-1/2"}
      />
      <span className="text-lg">:</span>
      <ComboboxInput
        label="Minute"
        value={minute}
        setValue={setMinute}
        options={minutes}
        placeholder="MM"
        width={"w-1/2"}
      />
      <ComboboxInput
        label="AM/PM"
        value={ampm}
        setValue={setAmpm}
        options={["am", "pm"]}
        placeholder="AM/PM"
        width={"w-2/8"}
      />
    </div>
  );
};

export default TimeElement;
