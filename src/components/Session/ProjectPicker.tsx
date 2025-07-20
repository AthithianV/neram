import { useProject } from '@/hooks/useProject';
import Selector from '../form/Selector';

type PropsType = {
    onChange: (project: number) => void;
    value: number;
};

const ProjectPicker = ({ onChange, value }: PropsType) => {
    const { data: projects = [], isLoading } = useProject();

    if (isLoading) {
        return null;
    }

    return (
        <Selector
            onChange={(val) => onChange(Number(val))}
            value={value.toString()}
            items={projects.map((project) => ({
                title: project.title,
                color: project.color ?? '',
                value: project.id.toString(),
            }))}
            placeholder="Select a Project"
            fallbackText="No Projects"
        />
    );
};

export default ProjectPicker;
