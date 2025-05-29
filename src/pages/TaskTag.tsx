import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TaskFormDialog } from '@/components/dashboard/TaskForm';
import { TagFormDialog } from '@/components/dashboard/TagForm';

const tasks = [
    { id: 1, title: 'Study', description: 'Description 1', color: '#121063' },
    { id: 2, title: 'Work', description: 'Description 2', color: '#3ab7bf' },
    { id: 3, title: 'Social', description: 'Description 3', color: '#78dcca' },
];

const tags = [
    { id: 1, title: 'Tag 1', description: 'Description 1', color: '#3ab7bf' },
];

type Item = {
    id: number;
    title: string;
    description: string;
    color: string;
};

type TabListProps = {
    items: Item[];
    type: 'tasks' | 'tags';
    FormDialog: any;
};

const ItemListCard = ({ items, type, FormDialog }: TabListProps) => {
    return (
        <Card className="flex-1 max-h-2/3 gap-1">
            <CardContent className="h-11/12 overflow-y-auto">
                <ul>
                    {items.length > 0 ? (
                        items.map((item) => (
                            <FormDialog
                                type="EDIT"
                                initialValue={item}
                                key={item.id}
                            >
                                <li
                                    className={cn(
                                        'hover:bg-gray-100 rounded-md cursor-pointer',
                                        'flex items-center gap-2 py-1 my-1 px-2'
                                    )}
                                >
                                    <span
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <div>{item.title}</div>
                                </li>
                            </FormDialog>
                        ))
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p>No {type} found</p>
                        </div>
                    )}
                </ul>
            </CardContent>
            <CardFooter className="flex justify-end">
                <FormDialog type="CREATE">
                    <Button variant="outline">
                        <Plus />
                        <span>Add {type === 'tasks' ? 'Task' : 'Tag'}</span>
                    </Button>
                </FormDialog>
            </CardFooter>
        </Card>
    );
};

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
                <ItemListCard
                    items={tasks}
                    type="tasks"
                    FormDialog={TaskFormDialog}
                />
            </TabsContent>

            <TabsContent value="tags">
                <ItemListCard
                    items={tags}
                    type="tags"
                    FormDialog={TagFormDialog}
                />
            </TabsContent>
        </Tabs>
    );
};

export default TaskTag;
