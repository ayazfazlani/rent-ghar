'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import cementRateApi from '@/lib/api/cement-rate/cement-rate.api';
import dynamic from 'next/dynamic';

const RichEditor = dynamic(() => import('@/components/RichEditor'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Editor...</div>,
});

const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Multan', 'Quetta', 'Faisalabad'];
const CATEGORIES = ['OPC Cement', 'SRC Cement', 'White Cement', 'Sulphate Resistant'];

export default function EditCementRatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    brand: '',
    price: '',
    change: '0',
    city: '',
    weightKg: '50',
    category: 'OPC Cement',
    description: '',
  });
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    cementRateApi.getRateById(id)
      .then(rate => {
        setForm({
          brand: rate.brand ?? '',
          price: String(rate.price ?? ''),
          change: String(rate.change ?? 0),
          city: rate.city ?? '',
          weightKg: String(rate.weightKg ?? 50),
          category: rate.category ?? 'OPC Cement',
          description: rate.description ?? '',
        });
        if (rate.image) setExistingImage(rate.image);
      })
      .catch(() => toast.error('Failed to load cement rate'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (field: string, value: string) => setForm(f => ({ ...f, [field]: value }));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setExistingImage(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setExistingImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const currentImageSrc = imagePreview ?? existingImage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand.trim()) return toast.error('Brand name is required');
    if (!form.price || isNaN(Number(form.price))) return toast.error('Valid price is required');
    if (!form.city) return toast.error('City is required');

    try {
      setSubmitting(true);
      const fd = new FormData();
      fd.append('brand', form.brand.trim());
      fd.append('price', form.price);
      fd.append('change', form.change);
      fd.append('city', form.city);
      fd.append('weightKg', form.weightKg);
      fd.append('category', form.category);
      fd.append('description', form.description);
      if (imageFile) fd.append('image', imageFile);

      await cementRateApi.updateRate(id, fd);
      toast.success('Cement rate updated successfully!');
      router.push('/dashboard/cement-rate');
    } catch (err: any) {
      toast.error('Error', { description: err?.response?.data?.message || 'Failed to update.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Cement Rate</h1>
        <p className="text-gray-500 text-sm mb-8">Update the price or details for this cement brand.</p>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              ref={fileInputRef}
              id="cement-image-edit"
            />
            <div
              onClick={() => !currentImageSrc && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl transition-colors ${
                currentImageSrc ? 'border-gray-300' : 'border-gray-300 hover:border-gray-500 cursor-pointer'
              } overflow-hidden`}
              style={{ aspectRatio: '1/1', maxWidth: 220 }}
            >
              {currentImageSrc ? (
                <>
                  <img src={currentImageSrc} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                  <ImageIcon className="w-10 h-10 text-gray-300" />
                  <span className="text-sm font-medium text-gray-500">Upload</span>
                  <span className="text-xs text-gray-400">Click to select image</span>
                </div>
              )}
            </div>
            {currentImageSrc && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-blue-600 hover:underline"
              >
                Change image
              </button>
            )}
          </div>

          {/* Brand */}
          <div className="space-y-1.5">
            <Label htmlFor="brand">Brand Name *</Label>
            <Input id="brand" placeholder="e.g. Lucky Cement" value={form.brand} onChange={e => set('brand', e.target.value)} required />
          </div>

          {/* Price + Change */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Price (Rs per bag) *</Label>
              <Input id="price" type="number" min={0} placeholder="e.g. 1300" value={form.price} onChange={e => set('price', e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="change">Price Change Today</Label>
              <Input id="change" type="number" placeholder="e.g. +20 or -10" value={form.change} onChange={e => set('change', e.target.value)} />
              <p className="text-xs text-gray-400">Positive = up, Negative = down, 0 = no change</p>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <Label htmlFor="weight">Bag Weight (Kg)</Label>
            <Input id="weight" type="number" min={1} value={form.weightKg} onChange={e => set('weightKg', e.target.value)} />
          </div>

          {/* City */}
          <div className="space-y-1.5">
            <Label>City *</Label>
            <Select value={form.city} onValueChange={v => set('city', v)}>
              <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
              <SelectContent>
                {CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Cement Type</Label>
            <Select value={form.category} onValueChange={v => set('category', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>Description</Label>
            <RichEditor value={form.description} onChange={v => set('description', v)} />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={submitting} className="flex items-center gap-2">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : 'Update Cement Rate'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/dashboard/cement-rate')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
