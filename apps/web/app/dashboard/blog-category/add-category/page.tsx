'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import blogCategoryApi from "@/lib/api/blog-category/blog-category.api";
export default function AddCategoryPage() {
    const router = useRouter();
    const formSchema = z.object({
        name: z.string().min(2,{message: "Name must be atleast 2 charcters long"}),
        description: z.string().optional(),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const response = await blogCategoryApi.createCategory(data);

            if(response.status === 201){
                toast.success("Category created successfully");
                form.reset();
                router.push("/dashboard/blog-category");
            }
            else{
                toast.error("Failed to create category");
            }
        } catch (error: any) {
            console.error("Error creating category:", error);
            toast.error("Error", {
                description: error?.response?.data?.message || "Failed to create category",
            });
        }
    };
    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Blog Category</h1>
                    <p className="text-gray-600 mb-8">
                        Add a new blog category to your blog.
                    </p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="name" render={({field}) => (
                                <FormItem>
                                    <FormLabel>Category Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g Property" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                         
                            <FormField control={form.control} name="description" render={({field}) => (

                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="e.g Property Description" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                            />

                            <div className="flex gap-4 pt-6">
                                <Button 
                                    type="submit" 
                                    className="flex-1"
                                    disabled={form.formState.isSubmitting}
                                >
                                    {form.formState.isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : "Add Category"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={form.formState.isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
