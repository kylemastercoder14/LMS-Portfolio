"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createCourse } from '@/app/actions/course';

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

const CreateCourse = () => {
	const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
		const response = await createCourse(values.title);
		toast.success('Course created successfully');
		router.push(`/teacher/courses/${response.id}`);
	} catch (error) {
		console.error(error);
		toast.error("Something went wrong. Please try again.");
	}
  };
  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-slate-600">
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to React'"
                    />
                  </FormControl>
                  <FormDescription>
                    What will you teach in this course?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/teacher/courses">
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </Link>
              <Button
                disabled={isSubmitting || !isValid}
                variant="default"
                type="submit"
              >
                Continue &rarr;
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCourse;
