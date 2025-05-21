import DialogFormWrapper from "../form/DialogFormWrapper";
import { Button } from "../ui/button";

const Workunit = () => {
  return (
    <div>
      <div>
        <Button variant={"default"}>Start</Button>
        <DialogFormWrapper name={"Add Work Unit"} />
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Workunit;
