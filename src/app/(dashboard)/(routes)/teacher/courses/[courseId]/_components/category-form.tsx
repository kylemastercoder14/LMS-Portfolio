"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";
import { addCourseCategory } from "@/app/actions/course";
import Combobox from "@/components/ui/combobox";
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "Category is required" }),
});

const CategoryForm = ({
  initialData,
  courseId,
  options,
}: {
  initialData: Course;
  courseId: string;
  options: { value: string; label: string }[];
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const router = useRouter();
  const toggleEdit = () => setIsEditing((prev) => !prev);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: initialData.categoryId ?? "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addCourseCategory(values.categoryId, courseId);
      toast.success("Course category added successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const selectedOption = options.find(
    (option) => option.value === initialData.categoryId
  );
  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course category
        <Button onClick={toggleEdit} variant="outline">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PencilIcon className="w-4 h-4" />
              Edit category
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData.categoryId && "text-slate-500 italic"
          )}
        >
          {selectedOption?.label || "No category provided"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            className="space-y-4 mt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      value={field.value}
                      onChangeAction={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default CategoryForm;
