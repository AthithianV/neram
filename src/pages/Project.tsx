import { Outlet } from 'react-router-dom';

import PageAnimation from '@/components/layouts/PageAnimation';
import ProjectTabs from '@/components/project/ProjectTabs';

const Project = () => {
    return (
        <PageAnimation>
            <div className="h-full">
                <ProjectTabs />
                <Outlet />
            </div>
        </PageAnimation>
    );
};

export default Project;
