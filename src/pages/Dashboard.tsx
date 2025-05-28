import DialogFormWrapper from "@/components/form/DialogFormWrapper";
import { Button } from "@/components/ui/button";
import WorkunitForm from "@/components/dashboard/WorkunitForm";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant={"default"}>Start</Button>
          <DialogFormWrapper name={"Add Work Unit"}>
            <WorkunitForm />
          </DialogFormWrapper>
        </div>
        <div>
          <Link to={"/task-tag"}>
            <Button variant={"outline"}>{"Task/Tag"}</Button>
          </Link>
        </div>
      </div>

      <div></div>
      <div></div>
    </div>
  );
};

export default Dashboard;
