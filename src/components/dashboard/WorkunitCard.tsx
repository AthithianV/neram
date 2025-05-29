import { Workunit } from "@/schema/WorkunitSchema";
import { formatTime } from "@/lib/time";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import WorkunitForm from "./WorkunitForm";

const WorkunitCard = ({ workunit }: { workunit: Workunit }) => {
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <li className="flex items-center justify-between px-4 py-2 border bg-white shadow rounded-md cursor-pointer hover:bg-gray-50">
          <div className="flex flex-col gap-2">
            <h3 className="text-md font-semibold">{workunit.title}</h3>
            <ul className="flex flex-wrap gap-2">
              {workunit.tags.map((tag) => (
                <li key={tag} className="text-sm text-gray-500">
                  <Badge>{tag}</Badge>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {formatTime(workunit.duration)}
            </p>
          </div>
        </li>
      </DialogTrigger>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-h-[95vh] overflow-y-auto custom-scrollbar"
      >
        <WorkunitForm defaultValues={workunit} />
      </DialogContent>
    </Dialog>
  );
};

export default WorkunitCard;
