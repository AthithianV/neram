import { useTask } from '@/hooks/useTask';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

type PropsType = {
    onChange: (task: number) => void;
    value: number;
    projectId: number;
};

const TaskPicker = ({ onChange, value, projectId }: PropsType) => {
    const { data: tasks = [] } = useTask(projectId);

    const selected = tasks.find((t) => t.id === value);

    return (
        <Select
            onValueChange={(value) => onChange(parseInt(value))}
            value={selected?.id?.toString() ?? ''}
        >
            <SelectTrigger className="w-full bg-white shadow overflow-hidden">
                <SelectValue placeholder="Select a Task" />
            </SelectTrigger>
            {tasks.length === 0 ? (
                <SelectContent>
                    <SelectItem value="No tasks found" disabled>
                        No tasks found
                    </SelectItem>
                </SelectContent>
            ) : (
                <SelectContent className="max-h-[200px] max-w-[400px] overflow-y-auto">
                    {tasks.map(({ title, id, color }) => (
                        <SelectItem
                            key={title}
                            value={id.toString()}
                            className="w-full"
                        >
                            <div className="flex items-center gap-2">
                                <span
                                    className="p-2 rounded-full"
                                    style={{ background: color }}
                                ></span>
                                <span className="max-w-[90%] block overflow-hidden text-ellipsis whitespace-nowrap ">
                                    {title}
                                </span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            )}
        </Select>
    );
};

export default TaskPicker;
