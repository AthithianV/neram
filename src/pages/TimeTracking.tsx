import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Workunit from "@/components/workunit";

const TimeTracking = () => {
  return (
    <Tabs defaultValue="workunit">
      <TabsList>
        <TabsTrigger value="workunit">Workunit</TabsTrigger>
        <TabsTrigger value="task">Task</TabsTrigger>
        <TabsTrigger value="tag">Tag</TabsTrigger>
      </TabsList>
      <TabsContent value="workunit">
        <Workunit />
      </TabsContent>
      <TabsContent value="task">Task</TabsContent>
      <TabsContent value="tag">Tag</TabsContent>
    </Tabs>
  );
};

export default TimeTracking;
