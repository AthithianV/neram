import { ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "../ui/dialog";

const DialogFormWrapper = ({
  title,
  description,
  trigger,
  children,
  modal = false,
}: {
  title: string;
  description: string;
  trigger: ReactNode;
  children: ReactNode;
  modal?: boolean;
}) => {
  return (
    <Dialog modal={modal}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-h-[95vh] overflow-y-auto custom-scrollbar"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormWrapper;
