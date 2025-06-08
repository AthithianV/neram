import { useTask } from '@/hooks/useTodo';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

type PropsType = {
    onChange: (task: string) => void;
    value: string;
};

const TaskItem = ({ title }: { title: string }) => {
    if (!title) return <></>;

    return (
        <SelectItem key={title} value={title}>
            {title}
        </SelectItem>
    );
};

const TaskList = () => {
    const { data: tasks = [] } = useTask();

    if (tasks.length === 0)
        return (
            <SelectContent>
                <SelectItem value="No tasks found" disabled>
                    No tasks found
                </SelectItem>
            </SelectContent>
        );

    return (
        <SelectContent className="max-h-[200px] overflow-y-auto">
            {tasks.map((task) => {
                if (!task.title) return <></>;
                return <TaskItem key={task.title} title={task.title} />;
            })}
        </SelectContent>
    );
};

const TaskPicker = ({ onChange, value }: PropsType) => {
    return (
        <Select onValueChange={onChange} defaultValue={value}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Task" />
            </SelectTrigger>
            <TaskList />
        </Select>
    );
};

export default TaskPicker;
