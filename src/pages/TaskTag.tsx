import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

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
    <Tabs defaultValue="tasks" className="w-2/3 m-auto">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="tasks">Tasks</TabsTrigger>
        <TabsTrigger value="tags">Tags</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks">
        <Card className="flex-1 max-h-2/3 gap-1">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent className="h-11/12 overflow-y-auto">
            <ul>
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={cn(
                    "hover:bg-gray-100 rounded cursor-pointer",
                    "flex items-center gap-2",
                    "py-1 my-1"
                  )}
                >
                  <div
                    className={`border-l-3 ps-1`}
                    style={{ borderColor: task.color }}
                  >
                    {task.title}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tags">
        <Card className="flex-1 max-h-2/3 gap-1">
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="h-11/12 overflow-y-auto">
            <ul>
              {tags.map((tag) => (
                <li
                  key={tag.id}
                  className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-lg cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 rounded-full ${tag.color} border border-gray-800`}
                  ></div>
                  <div>{tag.title}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default TaskTag;
