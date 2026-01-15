 "use client"

import { useState } from 'react'

export default function AddProperty() {
  const [listingType, setListingType] = useState('rent')
  const [propertyType, setPropertyType] = useState('')
  const [mainImage, setMainImage] = useState<string | null>(null)
  const [additionalImages, setAdditionalImages] = useState<(string | null)[]>([null, null, null])
  const [features, setFeatures] = useState<string[]>([''])

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMainImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImages = [...additionalImages]
        newImages[index] = reader.result as string
        setAdditionalImages(newImages)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeMainImage = () => {
    setMainImage(null)
  }

  const removeAdditionalImage = (index: number) => {
    const newImages = [...additionalImages]
    newImages[index] = null
    setAdditionalImages(newImages)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted')
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
                <select 
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white"
                >
                  <option value="">Select property type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Flat">Flat</option>
                  <option value="Commercial">Commercial</option>
                 </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  City / All Cities
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white">
                  <option value="">Select city</option>
                  <option value="All">All Cities</option>
                  <option value="Multan">Multan</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Islamabad">Islamabad</option>
                  </select>
              </div>
            </div>

            {/* Property Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Property Title
              </label>
              <input
                type="text"
                placeholder="E.g., Luxury 3 Bedroom Apartment in DHA"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Location / Address
              </label>
              <input
                type="text"
                placeholder="Enter complete address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Area (sq ft)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {/* Main Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Main Photo
              </label>
              {mainImage ? (
                <div className="relative">
                  <img 
                    src={mainImage} 
                    alt="Main property" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeMainImage}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
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
                    {additionalImages[index] ? (
                      <div className="relative">
                        <img 
                          src={additionalImages[index]!} 
                          alt={`Additional ${index + 1}`} 
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-500 transition-colors h-32 flex items-center justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleAdditionalImageUpload(e, index)}
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
                placeholder="Describe your property in detail... Include amenities, nearby facilities, and unique features"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent resize-none"
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
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
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
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-500 hover:text-gray-600 transition-colors font-medium"
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
                placeholder="03XX XXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-lg shadow-md hover:shadow-lg"
              >
                Publish Property
              </button>
              <button
                type="button"
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
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