import DialogFormWrapper from "@/components/form/DialogFormWrapper";
import { Button } from "@/components/ui/button";
import WorkunitForm from "@/components/dashboard/WorkunitForm";

const Dashboard = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
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

      <div></div>
      <div></div>
    </div>
  );
};

export default Dashboard;
