import { Outlet, useSearchParams } from 'react-router-dom';

import PageAnimation from '@/components/layouts/PageAnimation';
import DeleteProject from '@/components/project/DeleteProject';
import ProjectTabs from '@/components/project/ProjectTabs';
import DeleteTask from '@/components/task/DeleteTask';
import { useEffect, useState } from 'react';

const Project = () => {
    const [taskAlert, setTaskAlert] = useState(false);
    const [projectAlert, setProjectAlert] = useState(false);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const alertType = searchParams.get('alert');

        if (alertType === 'TASK') {
            setTaskAlert(true);
        } else if (alertType === 'PROJECT') {
            setProjectAlert(true);
        } else {
            setTaskAlert(false);
            setProjectAlert(false);
        }
    }, [searchParams]);

    return (
        <PageAnimation>
            <div className="h-full">
                <ProjectTabs />
                <DeleteTask isAlertOpen={taskAlert} setAlertOpen={setTaskAlert} />
                <DeleteProject
                    isAlertOpen={projectAlert}
                    setAlertOpen={setProjectAlert}
                />
                <Outlet />
            </div>
        </PageAnimation>
    );
};

export default Project;
