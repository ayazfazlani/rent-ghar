"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

// Assuming this is your API client (adjust path/name if different)
import cityApi from "@/lib/api/city/city.api"; // or "@/lib/api/city/city.api"

// Zod schema – only name is required, state and country are optional
const formSchema = z.object({
  name: z.string().min(2, { message: "City name must be at least 2 characters" }),
  state: z.string().optional(),
  country: z.string().optional(),
});

export default function AddCityPage() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      state: undefined,
      country: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Only send fields that have values (filter out empty strings)
      const payload: any = {
        name: values.name.trim(),
      };
      
      if (values.state && values.state.trim()) {
        payload.state = values.state.trim();
      }
      
      if (values.country && values.country.trim()) {
        payload.country = values.country.trim();
      }

      await cityApi.create(payload);

      toast.success("City created successfully!");
      form.reset();
      router.refresh();           // Refresh server components / data
      // Optional: router.push("/dashboard/cities"); // go to list
    } catch (error: any) {
      console.error("Create city error:", error);
      console.error("Error response:", error?.response?.data);
      
      // Get validation errors if they exist
      const validationErrors = error?.response?.data?.message;
      const errorMessage = Array.isArray(validationErrors) 
        ? validationErrors.join(', ')
        : validationErrors || error?.message || "Failed to create city. Please try again.";
      
      toast.error("Error", { description: errorMessage });
    }
  }

  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Add New City</h1>
          <p className="text-gray-600 mb-8">
            Add a city to make it available for property listings. Only the city name is required and must be unique.
          </p>

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
                    <FormLabel>State / Province (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sindh" {...field} value={field.value || ""} />
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
                    <FormLabel>Country (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Pakistan" {...field} value={field.value || ""} />
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
                      Creating...
                  </>
                ) : (
                    "Add City"
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