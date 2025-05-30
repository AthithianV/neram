import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import useWorkunitStore from '@/store/WorkunitStore';
import WorkunitCard from '@/components/workunit/WorkunitCard';
import { WorkunitSheet } from '@/components/workunit/WorkunitForm';

const Dashboard = () => {
    const { workunits } = useWorkunitStore();

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between h-1/12">
                <div className="flex gap-2">
                    <Button variant={'default'}>Start</Button>
                    <WorkunitSheet>
                        <Button variant={'default'}>Add Work Unit</Button>
                    </WorkunitSheet>
                </div>
                <div></div>
            </div>

            <ScrollArea className="h-11/12 border-t-2 pt-2">
                <ul className="flex flex-col gap-[1px]">
                    {workunits.map((workunit) => (
                        <WorkunitSheet
                            key={workunit.id}
                            defaultValue={workunit}
                        >
                            <WorkunitCard workunit={workunit} />
                        </WorkunitSheet>
                    ))}
                </ul>
            </ScrollArea>
        </div>
    );
};

export default Dashboard;
