import { useEffect, useState } from "react";
import { Input } from "../ui/input";

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
      <Input
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
      />
      <span className="text-lg">:</span>
      <Input
        type="number"
        value={minutes}
        onChange={(e) => setMinutes(e.target.value)}
      />
    </div>
  );
};

export default DurationElement;
