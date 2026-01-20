 "use client"

import { useState } from 'react'
import { Upload, X, Plus, Home, MapPin, Bed, Bath, Maximize, DollarSign, Phone, FileText, Sparkles } from 'lucide-react'

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
    console.log('Form submitted')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Add New Property</h1>
                <p className="text-gray-600 text-sm md:text-base">Fill in the details to list your property</p>
              </div>
            </div>
            
            <div className="space-y-6 md:space-y-8">
              {/* Listing Type */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Listing Type
                </label>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button
                    type="button"
                    onClick={() => setListingType('rent')}
                    className={`relative overflow-hidden py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${
                      listingType === 'rent'
                        ? 'bg-black text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {listingType !== 'rent' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700"></div>
                    )}
                    <span className="relative z-10">For Rent</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setListingType('sale')}
                    className={`relative overflow-hidden py-3 md:py-4 px-4 md:px-6 rounded-xl font-semibold transition-all duration-300 active:scale-95 ${
                      listingType === 'sale'
                        ? 'bg-black text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {listingType !== 'sale' && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-200%] hover:translate-x-[200%] transition-transform duration-700"></div>
                    )}
                    <span className="relative z-10">For Sale</span>
                  </button>
                </div>
              </div>

              {/* Property Type and City */}
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    Property Type
                  </label>
                  <select 
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300 bg-white"
                  >
                    <option value="">Select property type</option>
                    <option value="House">House</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Flat">Flat</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                    City
                  </label>
                  <select className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300 bg-white">
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
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Property Title
                </label>
                <input
                  type="text"
                  placeholder="E.g., Luxury 3 Bedroom Apartment in DHA"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location / Address
                </label>
                <input
                  type="text"
                  placeholder="Enter complete address"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                />
              </div>

              {/* Beds, Baths, Area */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Bed className="w-4 h-4" />
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Bath className="w-4 h-4" />
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Maximize className="w-4 h-4" />
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {listingType === 'rent' ? 'Monthly Rent (PKR)' : 'Sale Price (PKR)'}
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                />
              </div>

              {/* Main Photo */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Main Photo
                </label>
                {mainImage ? (
                  <div className="relative group">
                    <img 
                      src={mainImage} 
                      alt="Main property" 
                      className="w-full h-48 md:h-64 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute top-3 right-3 bg-black text-white p-2.5 rounded-xl hover:bg-gray-800 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="group border-2 border-dashed border-gray-300 rounded-xl p-6 md:p-8 text-center hover:border-black transition-all duration-300 hover:bg-gray-50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageUpload}
                      className="hidden"
                      id="main-photo"
                    />
                    <label htmlFor="main-photo" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mb-3 group-hover:text-black transition-colors duration-300" />
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-black transition-colors">Click to upload main photo</span>
                        <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Additional Photos */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">
                  Additional Photos
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index}>
                      {additionalImages[index] ? (
                        <div className="relative group">
                          <img 
                            src={additionalImages[index]!} 
                            alt={`Additional ${index + 1}`} 
                            className="w-full h-28 md:h-32 object-cover rounded-xl border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-2 right-2 bg-black text-white p-1.5 rounded-lg hover:bg-gray-800 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="group border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-black transition-all duration-300 h-28 md:h-32 flex items-center justify-center hover:bg-gray-50">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAdditionalImageUpload(e, index)}
                            className="hidden"
                            id={`photo-${index}`}
                          />
                          <label htmlFor={`photo-${index}`} className="cursor-pointer">
                            <div className="flex flex-col items-center">
                              <Plus className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mb-1 group-hover:text-black transition-colors" />
                              <span className="text-xs text-gray-600 group-hover:text-black transition-colors">Photo {index + 1}</span>
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
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Property Description
                </label>
                <textarea
                  rows={5}
                  placeholder="Describe your property in detail... Include amenities, nearby facilities, and unique features"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300 resize-none"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
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
                        className="flex-1 px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                      />
                      {features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-4 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 active:scale-95 font-medium whitespace-nowrap"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="w-full py-3.5 border-2 border-dashed border-gray-300 rounded-xl text-gray-700 hover:border-black hover:bg-gray-50 transition-all duration-300 font-semibold hover:scale-105 active:scale-95"
                  >
                    + Add More Features
                  </button>
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  placeholder="03XX XXXXXXX"
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 focus:border-black focus:ring-0 focus:shadow-lg outline-none hover:border-gray-300"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="flex-1 relative overflow-hidden group py-4 bg-black text-white rounded-xl font-bold text-base md:text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  <span className="relative z-10">Publish Property</span>
                </button>
                <button
                  type="button"
                  className="sm:w-auto px-6 md:px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 font-bold hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}