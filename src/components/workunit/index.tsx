import DialogFormWrapper from "../form/DialogFormWrapper";
import { Button } from "../ui/button";
import WorkunitForm from "./WorkunitForm";

const Workunit = () => {
  return (
    <div>
      <div>
        <Button variant={"default"}>Start</Button>
        <DialogFormWrapper name={"Add Work Unit"}>
          <WorkunitForm />
        </DialogFormWrapper>
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Workunit;
