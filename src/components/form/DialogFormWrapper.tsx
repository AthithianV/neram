import { ReactNode } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "../ui/dialog";

const DialogFormWrapper = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => {
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <div>
          <Button>{name}</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[95vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new work unit.
          </DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormWrapper;
