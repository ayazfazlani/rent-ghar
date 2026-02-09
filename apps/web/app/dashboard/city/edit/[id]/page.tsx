"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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

import cityApi from "@/lib/api/city/city.api";

// Zod schema
const formSchema = z.object({
  name: z.string().min(2, { message: "City name must be at least 2 characters" }),
  state: z.string().min(2, { message: "State/Province is required" }),
  country: z.string().min(2, { message: "Country is required" }),
});

export default function EditCityPage() {
  const router = useRouter();
  const params = useParams();
  const cityId = params.id as string;
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      state: "",
      country: "Pakistan",
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
      await cityApi.update(cityId, values);

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

