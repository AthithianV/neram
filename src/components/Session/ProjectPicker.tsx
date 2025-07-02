import { MinimalProject, useProject } from '@/hooks/useProject';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';
import { useEffect, useState } from 'react';

type PropsType = {
    onChange: (project: number) => void;
    value: number;
};

const ProjectPicker = ({ onChange, value }: PropsType) => {
    const { data: projects = [] } = useProject();
    const [selectedProject, setSelectedProject] = useState<MinimalProject>();

    useEffect(() => {
        if (value) {
            setSelectedProject(projects.find(({ id }) => id === value));
        }
    }, [value]);

    return (
        <Select
            onValueChange={(value) => onChange(parseInt(value))}
            value={selectedProject?.id.toString()}
        >
            <SelectTrigger className="w-full bg-white shadow overflow-hidden">
                <SelectValue placeholder="Select a Project" />
            </SelectTrigger>
            {projects.length > 0 ? (
                <SelectContent className="max-h-[200px] overflow-y-auto">
                    {projects.map(({ title, id, color }) => (
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
            ) : (
                <SelectContent>
                    <SelectItem value="No projects found" disabled>
                        No projects found
                    </SelectItem>
                </SelectContent>
            )}
        </Select>
    );
};

export default ProjectPicker;
