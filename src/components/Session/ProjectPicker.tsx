import { useProject } from '@/hooks/useProject';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

type PropsType = {
    onChange: (project: number) => void;
    value: number;
};

const ProjectItem = ({ title }: { title: string }) => {
    if (!title) return <></>;

    return (
        <SelectItem key={title} value={title}>
            {title}
        </SelectItem>
    );
};

const ProjectList = () => {
    const { data: projects = [] } = useProject();

    if (projects.length === 0)
        return (
            <SelectContent>
                <SelectItem value="No projects found" disabled>
                    No projects found
                </SelectItem>
            </SelectContent>
        );

    return (
        <SelectContent className="max-h-[200px] overflow-y-auto">
            {projects.map((project) => {
                if (!project.title) return <></>;
                return (
                    <ProjectItem key={project.title} title={project.title} />
                );
            })}
        </SelectContent>
    );
};

const ProjectPicker = ({ onChange, value }: PropsType) => {
    return (
        <Select
            onValueChange={(value) => onChange(parseInt(value))}
            value={value ? value.toString() : ''}
        >
            <SelectTrigger className="w-full bg-white shadow">
                <SelectValue placeholder="Select a Project" />
            </SelectTrigger>
            <ProjectList />
        </Select>
    );
};

export default ProjectPicker;
