import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

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
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Separator } from "../ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import SelectElement from "../form/SelectElement";
import TimeElement from "../form/TimeElement";
import DurationElement from "../form/DurationElement";
import WorkunitSchema from "@/schema/WorkunitSchema";
import { Textarea } from "../ui/textarea";

type WorkunitSchemaType = z.infer<typeof WorkunitSchema>;

const WorkunitForm = () => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<WorkunitSchemaType>({
    resolver: zodResolver(WorkunitSchema),
    defaultValues: {
      title: "",
      description: "",
      task: "",
      date: new Date(),
      startTime: dayjs(new Date()).subtract(1, "hour").toDate(),
      endTime: dayjs(new Date()).toDate(),
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

        <div className="flex gap-4 w-full">
          {/* Task */}
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem className="flex-1">
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
              <FormItem className="flex flex-col flex-1">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Popover
                    open={calendarOpen}
                    onOpenChange={setCalendarOpen}
                    modal={false}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          dayjs(field.value).format("DD/MM/YYYY")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent forceMount className="z-999">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

        <Separator orientation="vertical" />

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

        <div className="flex gap-4 w-full">
          {/* Duration */}
          <FormField
            control={form.control}
            name="duration"
            render={() => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <DurationElement
                    value={form.getValues("duration")}
                    setValue={(val) => {
                      form.setValue("duration", val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Separator orientation="vertical" />

          {/* Break */}
          <FormField
            control={form.control}
            name="break"
            render={() => (
              <FormItem>
                <FormLabel>Break</FormLabel>
                <FormControl>
                  <DurationElement
                    value={form.getValues("break")}
                    setValue={(val) => {
                      form.setValue("break", val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default WorkunitForm;
