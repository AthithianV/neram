import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import DialogFormWrapper from "@/components/form/DialogFormWrapper";
import TaskForm from "@/components/dashboard/TaskForm";
import TagForm from "@/components/dashboard/TagForm";

const tasks = [
  {
    id: 1,
    title: "Study",
    description: "Description 1",
    color: "#121063",
  },
  {
    id: 2,
    title: "Work",
    description: "Description 2",
    color: "#3ab7bf",
  },
  {
    id: 3,
    title: "Social",
    description: "Description 3",
    color: "#78dcca",
  },
];

const tags = [
  {
    id: 1,
    title: "Tag 1",
    description: "Description 1",
    color: "#3ab7bf",
  },
];

const TaskTag = () => {
  return (
    <Tabs
      defaultValue="tasks"
      className="w-5/12 max-lg:w-2/3 max-sm:w-full m-auto mt-20"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="tags">Tags</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks">
        <Card className="flex-1 max-h-2/3 gap-1">
          <CardContent className="h-11/12 overflow-y-auto">
            <ul>
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <DialogFormWrapper
                    title={"Edit Task"}
                    modal={true}
                    description={"Edit the details of the task."}
                    trigger={
                      <li
                        key={task.id}
                        className={cn(
                          "hover:bg-gray-100 rounded-md cursor-pointer",
                          "flex items-center gap-2",
                          "py-1 my-1 px-2"
                        )}
                      >
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: task.color }}
                        ></span>
                        <div>{task.title}</div>
                      </li>
                    }
                  >
                    <TaskForm />
                  </DialogFormWrapper>
                ))
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p>No tasks found</p>
                </div>
              )}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-end">
            <DialogFormWrapper
              title={"Add Task"}
              modal={true}
              description={"Add a new task."}
              trigger={
                <Button variant={"outline"}>
                  <Plus />
                  <span>Add Task</span>
                </Button>
              }
            >
              <TaskForm />
            </DialogFormWrapper>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="tags">
        <Card className="flex-1 max-h-2/3 gap-1">
          <CardContent className="h-11/12 overflow-y-auto">
            <ul>
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <DialogFormWrapper
                    modal={true}
                    title={"Edit Tag"}
                    description={"Edit the details of the tag."}
                    trigger={
                      <li
                        key={tag.id}
                        className={cn(
                          "flex items-center gap-2",
                          "hover:bg-gray-100 rounded cursor-pointer",
                          "py-1 my-1 px-2 rounded-md"
                        )}
                      >
                        <span
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        ></span>
                        <div>{tag.title}</div>
                      </li>
                    }
                  >
                    <TagForm />
                  </DialogFormWrapper>
                ))
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p>No tags found</p>
                </div>
              )}
            </ul>
          </CardContent>
          <CardFooter className="flex justify-end">
            <DialogFormWrapper
              modal={true}
              title={"Add Tag"}
              description={"Add a new tag."}
              trigger={
                <Button variant={"outline"}>
                  <Plus />
                  <span>Add Tag</span>
                </Button>
              }
            >
              <TagForm />
            </DialogFormWrapper>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TaskTag;
