import { useTask } from '@/hooks/useTask';
import Selector from '../form/Selector';

type PropsType = {
    onChange: (task: number) => void;
    value?: number;
    projectId: number;
};

const TaskPicker = ({ onChange, value, projectId }: PropsType) => {
    const { data: tasks = [], isLoading } = useTask(projectId);

    if (isLoading) return null;

    return (
        <Selector
            onChange={(val) => onChange(Number(val))}
            value={value ? value.toString() : 'undefined'}
            items={tasks.map((task) => ({
                title: task.title,
                color: '#EC4899',
                value: task.id.toString(),
            }))}
            fallbackText="No Task Available"
            placeholder="Select Task"
        />
    );
};

export default TaskPicker;
