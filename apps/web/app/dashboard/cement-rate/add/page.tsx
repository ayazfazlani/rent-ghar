'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import cementRateApi from '@/lib/api/cement-rate/cement-rate.api';

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Multan', 'Quetta', 'Faisalabad'];
const CATEGORIES = ['OPC Cement', 'SRC Cement', 'White Cement', 'Sulphate Resistant'];

export default function AddCementRatePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    brand: '',
    price: '',
    change: '0',
    city: '',
    weightKg: '50',
    category: 'OPC Cement',
  });

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand.trim()) return toast.error('Brand name is required');
    if (!form.price || isNaN(Number(form.price))) return toast.error('Valid price is required');
    if (!form.city) return toast.error('City is required');

    try {
      setSubmitting(true);
      await cementRateApi.createRate({
        brand: form.brand.trim(),
        price: Number(form.price),
        change: Number(form.change),
        city: form.city,
        weightKg: Number(form.weightKg),
        category: form.category,
      });
      toast.success('Cement rate added successfully!');
      router.push('/dashboard/cement-rate');
    } catch (err: any) {
      toast.error('Error', { description: err?.response?.data?.message || 'Failed to create cement rate.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add Cement Rate</h1>
        <p className="text-gray-500 text-sm mb-8">This will appear as a card on the public Cement Rate page.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Brand */}
          <div className="space-y-1.5">
            <Label htmlFor="brand">Brand Name *</Label>
            <Input
              id="brand"
              placeholder="e.g. Lucky Cement"
              value={form.brand}
              onChange={e => set('brand', e.target.value)}
              required
            />
          </div>

          {/* Price + Change in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (Rs per bag) *</Label>
              <Input
                id="price"
                type="number"
                min={0}
                placeholder="e.g. 1300"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="change">Price Change Today</Label>
              <Input
                id="change"
                type="number"
                placeholder="e.g. +20 or -10"
                value={form.change}
                onChange={e => set('change', e.target.value)}
              />
              <p className="text-xs text-gray-400">Positive = price went up, Negative = price went down</p>
            </div>
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label>City *</Label>
            <Select value={form.city} onValueChange={v => set('city', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Category + Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Cement Type</Label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="weight">Bag Weight (Kg)</Label>
              <Input
                id="weight"
                type="number"
                min={1}
                value={form.weightKg}
                onChange={e => set('weightKg', e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={submitting} className="flex items-center gap-2">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Save Cement Rate'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/cement-rate')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
