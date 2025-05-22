import { ReactNode } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "../ui/dialog";

const DialogFormWrapper = ({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{name}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[500px] overflow-y-auto hide-scrollbar">
          <div className="bg-gradient-to-t from-white to-transparent">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormWrapper;
