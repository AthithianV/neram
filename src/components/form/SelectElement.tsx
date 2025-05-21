import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

const SelectElement = ({
  field,
  options,
  defaultOption,
}: {
  field: any;
  options: { title: string; value: string }[];
  defaultOption: { title: string; value: string };
}) => {
  return (
    <Select onValueChange={field.onChange} defaultValue={field.value}>
      <SelectTrigger className={"w-full"}>
        <SelectValue placeholder={defaultOption.title} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem value={option.value}>{option.title}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectElement;
