import { Outlet, useOutlet, useSearchParams } from 'react-router-dom';

import PageAnimation from '@/components/layouts/PageAnimation';
import DeleteProject from '@/components/project/DeleteProject';
import ProjectTabs from '@/components/project/ProjectTabs';
import DeleteTask from '@/components/task/DeleteTask';
import { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

const Project = () => {
    const [taskAlert, setTaskAlert] = useState(false);
    const [projectAlert, setProjectAlert] = useState(false);

    const [searchParams] = useSearchParams();

    const outlet = useOutlet();

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
                <DeleteTask
                    isAlertOpen={taskAlert}
                    setAlertOpen={setTaskAlert}
                />
                <DeleteProject
                    isAlertOpen={projectAlert}
                    setAlertOpen={setProjectAlert}
                />
                <div className="flex-1">
                    {outlet ? <Outlet /> : <EmptyProjectState />}
                </div>
            </div>
        </PageAnimation>
    );
};

const EmptyProjectState = () => {
    return (
        <div className="flex items-center justify-center h-full text-center mt-[15vh] bg-sidebar w-fit mx-auto p-10 shadow rounded-[5px]">
            <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-muted-foreground">
                    No project selected
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                    Choose a project from the tab or create a new one to get
                    started.
                </p>

                <Accordion
                    type="single"
                    collapsible
                    className="w-full text-left"
                >
                    <AccordionItem value="create-task">
                        <AccordionTrigger>Create a Task</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                            Open a project and click <b>“New Task”</b> to create
                            one. You can assign it to a project, set deadlines,
                            and add notes.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="drag-drop">
                        <AccordionTrigger>
                            Organize with Drag & Drop
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                            Drag tasks between columns (e.g.,{' '}
                            <b>Todo → In Progress → Done</b>) to keep your work
                            organized like a Kanban board.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="task-timer">
                        <AccordionTrigger>Track Time on Tasks</AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                            Each task can be timed. Start the timer to stay
                            focused, and view time spent in the{' '}
                            <b>Statistics</b> section later.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default Project;
