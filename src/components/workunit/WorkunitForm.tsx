import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import WorkunitSchema from "@/schema/WorkunitSchema";
import { Textarea } from "../ui/textarea";
import SelectElement from "../form/SelectElement";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import TimeElement from "../form/TimeElement";

type WorkunitSchemaType = z.infer<typeof WorkunitSchema>;

const WorkunitForm = () => {
  const form = useForm<WorkunitSchemaType>({
    resolver: zodResolver(WorkunitSchema),
    defaultValues: {
      title: "",
      description: "",
      task: "",
      date: new Date(),
      startTime: dayjs(new Date()).subtract(1, "hour").format("HH:mm a"),
      endTime: dayjs(new Date()).format("HH:mm a"),
      duration: 60 * 60,
      break: 0,
      tags: [],
    },
  });

  function onSubmit(data: z.infer<typeof WorkunitSchema>) {
    toast("Work unit has been Created");
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Task */}
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task</FormLabel>
              <FormControl>
                <SelectElement
                  field={field}
                  options={[
                    { title: "Study", value: "study" },
                    { title: "work", value: "work" },
                  ]}
                  defaultOption={{ title: "Study", value: "study" }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        dayjs(field.value).format("DD/MM/YYYY")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={false}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Time */}
        <FormField
          control={form.control}
          name="startTime"
          render={() => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <TimeElement
                  value={form.getValues("startTime")}
                  setValue={(val) => {
                    form.setValue("startTime", val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Time */}
        <FormField
          control={form.control}
          name="endTime"
          render={() => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <TimeElement
                  value={form.getValues("endTime")}
                  setValue={(val) => {
                    form.setValue("endTime", val);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Duration */}
        <FormField
          control={form.control}
          name="duration"
          render={() => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <TimeElement
                  value={form.getValues("duration")}
                  withAmPm={false}
                  setValue={(val) => {
                    const [hours, minutes] = val.split(":");
                    const duration = parseInt(hours) * 60 + parseInt(minutes);
                    form.setValue("duration", duration);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Break */}
        <FormField
          control={form.control}
          name="break"
          render={() => (
            <FormItem>
              <FormLabel>Break</FormLabel>
              <FormControl>
                <TimeElement
                  value={form.getValues("break")}
                  withAmPm={false}
                  setValue={(val) => {
                    const [hours, minutes] = val.split(":");
                    const duration = parseInt(hours) * 60 + parseInt(minutes);
                    form.setValue("break", duration);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default WorkunitForm;
