import { ReactNode } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "../ui/dialog";

type DialogFormWrapperProps = {
  title: string;
  description: string;
  trigger: ReactNode;
  children: ReactNode;
  modal?: boolean;
};

export const DialogFormTrigger = ({ children }: { children: ReactNode }) => {
  return <DialogTrigger asChild>{children}</DialogTrigger>;
};

export const DialogFormContent = ({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <DialogContent className="max-h-[95vh] overflow-y-auto custom-scrollbar">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {children}
    </DialogContent>
  );
};

const DialogFormWrapper = ({
  title,
  description,
  trigger,
  children,
  modal = false,
}: DialogFormWrapperProps) => {
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
