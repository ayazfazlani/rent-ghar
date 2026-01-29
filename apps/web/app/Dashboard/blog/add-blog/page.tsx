'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import blogApi from "@/lib/api/blog/blog.api";
import blogCategoryApi from "@/lib/api/blog-category/blog-category.api";
import { ImagePickerDialog, type GalleryImageItem } from "@/components/ImagePickerDialog";

const formSchema = z.object({
    title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
    content: z.string().min(10, { message: "Content must be at least 10 characters long" }),
    excerpt: z.string().optional(),
    slug: z.string().optional(),
    tags: z.string().optional(),
    featuredImage: z.string().url().optional().or(z.literal("")),
    status: z.enum(['draft', 'published']).optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().max(160, { message: "Meta description must be at most 160 characters" }).optional(),
    canonicalUrl: z.string().url().optional().or(z.literal("")),
    categoryId: z.string().optional(),
});

export default function AddBlogPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [imagePickerOpen, setImagePickerOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            excerpt: "",
            tags: "",
            slug: "",
            featuredImage: "",
            status: "draft",
            metaTitle: "",
            metaDescription: "",
            canonicalUrl: "",
            categoryId: "none",
        },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await blogCategoryApi.getAllCategories();
                setCategories(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const payload: any = {
                title: data.title,
                content: data.content,
                excerpt: data.excerpt || undefined,
                status: data.status || 'draft',
                metaTitle: data.metaTitle || undefined,
                metaDescription: data.metaDescription || undefined,
                featuredImage: data.featuredImage || undefined,
                canonicalUrl: data.canonicalUrl || undefined,
            };

            // Handle slug - optional, will be auto-generated from title if not provided
            if (data.slug && data.slug.trim()) {
                payload.slug = data.slug.trim().toLowerCase();
            }

            // Parse tags from comma-separated string
            if (data.tags) {
                payload.tags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            }

            if (data.categoryId && data.categoryId !== "none") {
                payload.categoryId = data.categoryId;
            }

            const response = await blogApi.createBlog(payload);

            if (response.status === 201) {
                toast.success("Blog created successfully");
                form.reset();
                router.push("/dashboard/blog");
            } else {
                toast.error("Failed to create blog");
            }
        } catch (error: any) {
            console.error("Error creating blog:", error);
            toast.error("Error", {
                description: error?.response?.data?.message || "Failed to create blog",
            });
        }
    };

    return (
        <div className="w-full">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New Blog Post</h1>
                    <p className="text-gray-600 mb-8">
                        Create a new blog post for your website.
                    </p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField control={form.control} name="title" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g How to Buy Your First Home" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="excerpt" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Excerpt</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="A brief summary of the blog post (150-160 characters recommended)"
                                            rows={3}
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="content" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content *</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Write your blog post content here..."
                                            rows={15}
                                            {...field} 
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

{/* slug is auto generated from the title */}
                            <FormField control={form.control} name="slug" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g how-to-buy-your-first-home" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="status" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="draft">Draft</SelectItem>
                                                <SelectItem value="published">Published</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="categoryId" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select 
                                            onValueChange={(value) => field.onChange(value === "none" ? undefined : value)} 
                                            value={field.value || "none"}
                                            disabled={loadingCategories}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category (optional)" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                {categories.map((category) => (
                                                    <SelectItem key={category._id} value={category._id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="tags" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tags (comma-separated)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g real estate, property, home" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="featuredImage" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Featured Image</FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <Input 
                                                    placeholder="https://example.com/image.jpg" 
                                                    {...field} 
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => setImagePickerOpen(true)}
                                                    title="Choose from gallery"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            {field.value && (
                                                <div className="flex items-center gap-3 mt-2">
                                                    <div className="w-16 h-16 rounded-md overflow-hidden bg-muted">
                                                        <img
                                                            src={field.value}
                                                            alt="Featured preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => field.onChange("")}
                                                    >
                                                        Remove image
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="metaTitle" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Title (SEO)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="SEO title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="metaDescription" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Meta Description (SEO)</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="SEO description (max 160 characters)"
                                                rows={2}
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="canonicalUrl" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Canonical URL (SEO)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/blog/post" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

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
                                    ) : "Create Blog Post"}
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
        <ImagePickerDialog
            open={imagePickerOpen}
            onOpenChange={setImagePickerOpen}
            onSelect={(image: GalleryImageItem) => {
                const url = image.url;
                form.setValue("featuredImage", url, { shouldValidate: true });
            }}
            title="Select Featured Image"
            description="Choose an existing image from the gallery to use as the featured image for this blog post."
        />
    )
}

