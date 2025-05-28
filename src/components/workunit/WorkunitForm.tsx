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

import TimeElement from "../form/TimeElement";
import DurationElement from "../form/DurationElement";
import WorkunitSchema from "@/schema/WorkunitSchema";
import { Textarea } from "../ui/textarea";
import { SelectGroup, SelectContent } from "../ui/select";
import { Select, SelectItem, SelectValue } from "../ui/select";
import { SelectTrigger } from "../ui/select";

const taskOptions = [
  { title: "Study", value: "study" },
  { title: "work", value: "work" },
];

type WorkunitSchemaType = z.infer<typeof WorkunitSchema>;

const WorkunitForm = () => {
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

        <div className="flex gap-6 w-full">
          {/* Task */}
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Task</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder="Select a Task"
                        defaultValue={"Study"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {taskOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
                  <Popover>
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) field.onChange(date);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-6 w-full">
          {/* Start Time */}
          <FormField
            control={form.control}
            name="startTime"
            render={() => (
              <FormItem className="flex-1">
                <FormLabel>Start Time</FormLabel>
                <TimeElement
                  value={form.getValues("startTime")}
                  setValue={(val) => form.setValue("startTime", val)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Time */}
          <FormField
            control={form.control}
            name="endTime"
            render={() => (
              <FormItem className="flex-1">
                <FormLabel>End Time</FormLabel>
                <TimeElement
                  value={form.getValues("endTime")}
                  setValue={(val) => form.setValue("endTime", val)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-6 w-full">
          {/* Start Time */}
          <FormField
            control={form.control}
            name="duration"
            render={() => (
              <FormItem className="flex-1">
                <FormLabel>Duration</FormLabel>
                <DurationElement
                  value={form.getValues("duration")}
                  setValue={(val) => form.setValue("duration", val)}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Break */}
          <FormField
            control={form.control}
            name="break"
            render={() => (
              <FormItem className="flex-1">
                <FormLabel>Break</FormLabel>
                <DurationElement
                  value={form.getValues("break")}
                  setValue={(val) => form.setValue("break", val)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="cursor-pointer">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WorkunitForm;
