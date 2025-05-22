import { useEffect, useState } from "react";
import ComboboxInput from "./ComboxInput";

const TimeElement = ({
  setValue,
  withAmPm = true,
}: {
  setValue: (val: string) => void;
  withAmPm?: boolean;
}) => {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmpm] = useState("am");

  useEffect(() => {
    setValue(`${hour}:${minute} ${ampm}`);
  }, [hour, minute, ampm, setValue]);

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
        width={withAmPm ? "w-3/8" : "w-1/2"}
      />
      <span className="text-lg">:</span>
      <ComboboxInput
        label="Minute"
        value={minute}
        setValue={setMinute}
        options={minutes}
        placeholder="MM"
        width={withAmPm ? "w-3/8" : "w-1/2"}
      />
      {withAmPm && (
        <ComboboxInput
          label="AM/PM"
          value={ampm}
          setValue={setAmpm}
          options={["am", "pm"]}
          placeholder="AM/PM"
          width={"w-2/8"}
        />
      )}
    </div>
  );
};

export default TimeElement;
