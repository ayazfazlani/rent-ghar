"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
const RichEditor = dynamic(() => import("@/components/RichEditor"), {
  ssr: false,
  loading: () => <div className="h-[200px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Editor...</div>
});
import { useEffect, useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePickerDialog } from "@/components/ImagePickerDialog";
import { Image as ImageIcon, X } from "lucide-react";

import cityApi from "@/lib/api/city/city.api";
import { toTitleCase } from "@/lib/utils";

// Zod schema
const formSchema = z.object({
  name: z.string().min(2, { message: "City name must be at least 2 characters" }),
  state: z.string().min(2, { message: "State/Province is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
});

export default function EditCityPage() {
  const router = useRouter();
  const params = useParams();
  const cityId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      state: "",
      country: "Pakistan",
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      description: "",
      thumbnail: "",
    },
  });

  const isLoading = form.formState.isSubmitting || loading;

  // Fetch city data on mount
  useEffect(() => {
    const fetchCity = async () => {
      try {
        setLoading(true);
        const city = await cityApi.getById(cityId);
        form.reset({
          name: city.name || "",
          state: city.state || "",
          country: city.country || "Pakistan",
          metaTitle: city.metaTitle || "",
          metaDescription: city.metaDescription || "",
          canonicalUrl: city.canonicalUrl || "",
          description: city.description || "",
          thumbnail: city.thumbnail || "",
        });
      } catch (error: any) {
        console.error("Error fetching city:", error);
        toast.error("Error", {
          description: error?.response?.data?.message || "Failed to load city. Please try again.",
        });
        router.push("/dashboard/city");
      } finally {
        setLoading(false);
      }
    };

    if (cityId) {
      fetchCity();
    }
  }, [cityId, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        ...values,
        name: toTitleCase(values.name.trim()),
        state: toTitleCase(values.state.trim()),
        country: toTitleCase(values.country.trim()),
      };
      await cityApi.update(cityId, payload);

      toast.success("City updated successfully!");
      router.push("/dashboard/city");
    } catch (error: any) {
      console.error("Update city error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update city. Please try again.";
      toast.error("Error", { description: message });
    }
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-3 text-gray-600">Loading city...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit City</h1>
          <p className="text-gray-600 mb-8">Update city information.</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* City Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Karachi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State / Province */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State / Province *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Sindh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Country */}
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Pakistan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* City Thumbnail */}
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City Thumbnail (Optional)</FormLabel>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <FormControl>
                          <Input
                            placeholder="Image URL or choose from gallery"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setImageDialogOpen(true)}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Gallery
                        </Button>
                      </div>

                      {field.value && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-gray-50">
                          <img
                            src={field.value}
                            alt="City thumbnail preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image+URL';
                            }}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={() => field.onChange("")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Meta Title */}
                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title (SEO)</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO Title" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Canonical URL */}
                <FormField
                  control={form.control}
                  name="canonicalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/city" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Meta Description */}
              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description (SEO)</FormLabel>
                    <FormControl>
                      <Input placeholder="SEO Description" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rich Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City Description (Rich Text)</FormLabel>
                    <FormControl>
                      <RichEditor
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Picker Dialog */}
              <ImagePickerDialog
                open={imageDialogOpen}
                onOpenChange={setImageDialogOpen}
                onSelect={(image) => {
                  form.setValue("thumbnail", image.url);
                }}
                title="Select City Thumbnail"
                description="Choose an image for the city card on the home page."
              />

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gray-800 hover:bg-gray-900"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update City"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}

