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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import areaApi from "@/lib/api/area/area.api";
import cityApi from "@/lib/api/city/city.api";
import { toTitleCase } from "@/lib/utils";

// Zod schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Area name must be at least 2 characters" }),
  areaSlug: z.string().min(3, { message: "Area slug is required" }),
  city: z.string().min(1, { message: "Please select a city" }),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional(),
  description: z.string().optional(),
});

export default function EditAreaPage() {
  const router = useRouter();
  const params = useParams();
  const areaId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<Array<{ _id: string; name: string; state?: string; country?: string }>>([]);
  const [loadingCities, setLoadingCities] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      areaSlug: "",
      city: "",
      metaTitle: "",
      metaDescription: "",
      canonicalUrl: "",
      description: "",
    },
  });

  const isLoading = form.formState.isSubmitting || loading;

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const data = await cityApi.getAll();
        setCities(data);
      } catch (error: any) {
        console.error("Error fetching cities:", error);
        toast.error("Error", {
          description: "Failed to load cities. Please try again.",
        });
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, []);

  // Fetch area data on mount
  useEffect(() => {
    const fetchArea = async () => {
      try {
        setLoading(true);
        const area = await areaApi.getById(areaId);

        // Set form values
        form.reset({
          name: area.name || "",
          city: typeof area.city === 'string' ? area.city : area.city?._id || "",
          areaSlug: area.areaSlug || "",
          metaTitle: area.metaTitle || "",
          metaDescription: area.metaDescription || "",
          canonicalUrl: area.canonicalUrl || "",
          description: area.description || "",
        });
      } catch (error: any) {
        console.error("Error fetching area:", error);
        toast.error("Error", {
          description: error?.response?.data?.message || "Failed to load area. Please try again.",
        });
        router.push("/dashboard/area");
      } finally {
        setLoading(false);
      }
    };

    if (areaId) {
      fetchArea();
    }
  }, [areaId, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await areaApi.update(areaId, {
        name: toTitleCase(values.name),
        city: values.city,
        areaSlug: values.areaSlug,
        metaTitle: values.metaTitle?.trim() || undefined,
        metaDescription: values.metaDescription?.trim() || undefined,
        canonicalUrl: values.canonicalUrl?.trim() || undefined,
        description: values.description?.trim() || undefined,
      });

      toast.success("Area updated successfully!");
      router.push("/dashboard/area");
    } catch (error: any) {
      console.error("Update area error:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update area. Please try again.";
      toast.error("Error", { description: message });
    }
  }

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Area</h1>
          <p className="text-gray-600 mb-8">
            Update area information for property listings.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-gray-600">Loading area...</span>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* City Selection */}
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isLoading || loadingCities}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingCities ? "Loading cities..." : "Select a city"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={String(city._id)} value={String(city._id)}>
                              {city.name}{city.state ? `, ${city.state}` : ''}{city.country ? `, ${city.country}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Area Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. DHA Phase 5" {...field}
                          onChange={(e) => {
                            field.onChange(e.target.value)
                            const slug = e.target.value.replace(/[^a-zA-Z0-9]+/g, '-').trim().toLowerCase()
                            form.setValue("areaSlug", slug)
                            form.setValue("canonicalUrl", `https://propertydealer.pk/area/${slug}`)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                {/* Area Slug */}
                <FormField
                  control={form.control}
                  name="areaSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. dha-phase-5" {...field} />
                      </FormControl>
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
                          <Input placeholder="https://example.com/area" {...field} value={field.value || ""} />
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
                      <FormLabel>Area Description (Rich Text)</FormLabel>
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

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading || loadingCities}
                    className="flex-1 bg-gray-800 hover:bg-gray-900"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Area"
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
          )}
        </div>
      </div>
    </div>
  );
}

