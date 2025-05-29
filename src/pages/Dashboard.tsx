import DialogFormWrapper from "@/components/form/DialogFormWrapper";
import { Button } from "@/components/ui/button";
import WorkunitForm from "@/components/dashboard/WorkunitForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import useWorkunitStore from "@/store/WorkunitStore";
import WorkunitCard from "@/components/dashboard/WorkunitCard";

const Dashboard = () => {
  const { workunits } = useWorkunitStore();
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between h-1/12">
        <div className="flex gap-2">
          <Button variant={"default"}>Start</Button>
          <DialogFormWrapper
            title={"Add Work Unit"}
            description={"Fill in the details below to create a new work unit."}
            trigger={<Button variant={"default"}>Add Work Unit</Button>}
          >
            <WorkunitForm />
          </DialogFormWrapper>
        </div>
        <div></div>
      </div>

      <ScrollArea className="h-11/12">
        <ul className="flex flex-col gap-[1px]">
          {workunits.map((workunit) => (
            <WorkunitCard key={workunit.id} workunit={workunit} />
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default Dashboard;
