"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { propertyApi } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export default function AddProperty() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  // Form state
  const [listingType, setListingType] = useState<'rent' | 'sale'>('rent')
  const [propertyType, setPropertyType] = useState('')
  const [city, setCity] = useState('')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [area, setArea] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  
  // Image state - store both File objects and preview URLs
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<(File | null)[]>([null, null, null])
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<(string | null)[]>([null, null, null])
  const [features, setFeatures] = useState<string[]>([''])

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setMainImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const newFiles = [...additionalImageFiles]
      newFiles[index] = file
      setAdditionalImageFiles(newFiles)
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const newPreviews = [...additionalImagePreviews]
        newPreviews[index] = reader.result as string
        setAdditionalImagePreviews(newPreviews)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeMainImage = () => {
    setMainImageFile(null)
    setMainImagePreview(null)
  }

  const removeAdditionalImage = (index: number) => {
    const newFiles = [...additionalImageFiles]
    newFiles[index] = null
    setAdditionalImageFiles(newFiles)
    
    const newPreviews = [...additionalImagePreviews]
    newPreviews[index] = null
    setAdditionalImagePreviews(newPreviews)
  }

  const addFeature = () => {
    setFeatures([...features, ''])
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features]
    newFeatures[index] = value
    setFeatures(newFeatures)
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  // Map frontend propertyType to backend format (lowercase)
  const mapPropertyTypeToBackend = (type: string): 'house' | 'apartment' | 'flat' | 'commercial' => {
    const mapping: Record<string, 'house' | 'apartment' | 'flat' | 'commercial'> = {
      'House': 'house',
      'Apartment': 'apartment',
      'Flat': 'flat',
      'Commercial': 'commercial',
    }
    return mapping[type] || 'house'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!propertyType || !city || !title || !location || !bedrooms || !bathrooms || !area || !price || !description || !contactNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!mainImageFile) {
      toast.error('Please upload a main photo')
      return
    }

    setIsLoading(true)

    try {
      // Create FormData
      const formData = new FormData()
      
      // Add main photo
      formData.append('mainPhoto', mainImageFile)
      
      // Add additional photos (only non-null files)
      additionalImageFiles.forEach((file) => {
        if (file) {
          formData.append('additionalPhotos', file)
        }
      })
      
      // Add JSON data as separate fields (backend expects these in the body)
      formData.append('listingType', listingType)
      formData.append('propertyType', mapPropertyTypeToBackend(propertyType))
      formData.append('city', city === 'All' ? '' : city)
      formData.append('title', title)
      formData.append('location', location)
      formData.append('bedrooms', bedrooms)
      formData.append('bathrooms', bathrooms)
      formData.append('area', area)
      formData.append('price', price)
      formData.append('description', description)
      formData.append('contactNumber', contactNumber)
      
      // Add features (filter out empty strings)
      const validFeatures = features.filter(f => f.trim() !== '')
      if (validFeatures.length > 0) {
        validFeatures.forEach((feature, index) => {
          formData.append(`features[${index}]`, feature)
        })
      }

      // Submit to API
      const response = await propertyApi.create(formData)
      
      toast.success('Property submitted successfully!', {
        description: 'Your property is pending approval and will be visible once approved.',
      })
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/Dashboard')
        router.refresh()
      }, 1500)
      
    } catch (error: any) {
      console.error('Error submitting property:', error)
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        'Failed to submit property. Please try again.'
      
      toast.error('Submission Failed', {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Add New Property</h1>
          <p className="text-gray-600 mb-8">Fill in the details to list your property</p>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Listing Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Listing Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setListingType('rent')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                    listingType === 'rent'
                      ? 'bg-gray-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  For Rent
                </button>
                <button
                  type="button"
                  onClick={() => setListingType('sale')}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
                    listingType === 'sale'
                      ? 'bg-gray-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  For Sale
                </button>
              </div>
            </div>

            {/* Property Type and All Cities */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Property Type
                </label>
                <Select value={propertyType} onValueChange={setPropertyType} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Flat">Flat</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  City
                </label>
                <Select value={city} onValueChange={setCity} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Multan">Multan</SelectItem>
                    <SelectItem value="Lahore">Lahore</SelectItem>
                    <SelectItem value="Karachi">Karachi</SelectItem>
                    <SelectItem value="Islamabad">Islamabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Property Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Property Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Luxury 3 Bedroom Apartment in DHA"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Location / Address
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter complete address"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Beds, Baths, and Area */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  placeholder="0"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  placeholder="0"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  min="0"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="0"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {listingType === 'rent' ? 'Monthly Rent (PKR)' : 'Sale Price (PKR)'}
              </label>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter amount"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Main Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Main Photo
              </label>
              {mainImagePreview ? (
                <div className="relative">
                  <img 
                    src={mainImagePreview} 
                    alt="Main property" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    disabled={isLoading}
                    className="hidden"
                    id="main-photo"
                  />
                  <label htmlFor="main-photo" className="cursor-pointer">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Click to upload main photo</span>
                      <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Additional Photos */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Additional Photos
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((index) => (
                  <div key={index}>
                    {additionalImagePreviews[index] ? (
                      <div className="relative">
                        <img 
                          src={additionalImagePreviews[index]!} 
                          alt={`Additional ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-500 transition-colors h-32 flex items-center justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAdditionalImageUpload(e, index)}
                          disabled={isLoading}
                          className="hidden"
                          id={`photo-${index}`}
                        />
                        <label htmlFor={`photo-${index}`} className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="text-xs text-gray-600">Photo {index + 1}</span>
                          </div>
                        </label>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Property Description
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your property in detail... Include amenities, nearby facilities, and unique features"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Property Features
              </label>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1} (e.g., Swimming Pool, Parking, Security)`}
                      disabled={isLoading}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFeature}
                  disabled={isLoading}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-500 hover:text-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  + Add More Features
                </button>
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Contact Number
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="03XX XXXXXXX"
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Publish Property'
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push('/Dashboard')}
                disabled={isLoading}
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}