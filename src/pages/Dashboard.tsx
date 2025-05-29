import {
  DialogFormContent,
  DialogFormTrigger,
} from "@/components/form/DialogFormWrapper";
import { Button } from "@/components/ui/button";
import WorkunitForm from "@/components/dashboard/WorkunitForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog } from "@/components/ui/dialog";
import useWorkunitStore from "@/store/WorkunitStore";
import WorkunitCard from "@/components/dashboard/WorkunitCard";

const Dashboard = () => {
  const { workunits } = useWorkunitStore();
  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between h-1/12">
        <div className="flex gap-2">
          <Button variant={"default"}>Start</Button>
          <Dialog modal={false}>
            <DialogFormTrigger>
              <Button variant={"default"}>Add Work Unit</Button>
            </DialogFormTrigger>
            <DialogFormContent
              title={"Add Work Unit"}
              description={
                "Fill in the details below to create a new work unit."
              }
            >
              <WorkunitForm />
            </DialogFormContent>
          </Dialog>
        </div>
        <div></div>
      </div>

      <ScrollArea className="h-11/12 border-t-2">
        <ul className="flex flex-col gap-[1px]">
          {workunits.map((workunit) => (
            <Dialog modal={false} key={workunit.id}>
              <DialogFormTrigger>
                <WorkunitCard key={workunit.id} workunit={workunit} />
              </DialogFormTrigger>
              <DialogFormContent
                title={"Edit Work Unit"}
                description={"Fill in the details below to edit the work unit."}
              >
                <WorkunitForm defaultValues={workunit} />
              </DialogFormContent>
            </Dialog>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
};

export default Dashboard;
