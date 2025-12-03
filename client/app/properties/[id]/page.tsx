'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { propertyApi } from '../../lib/api';
import { Property } from '../../lib/types';
import { MapPin, Home, Maximize, CheckCircle, ArrowLeft, Phone, Mail, Calendar } from 'lucide-react';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';

const PropertyDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const data = await propertyApi.getById(params.id as string);
        setProperty(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load property details');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProperty();
    }
  }, [params.id]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!property) return <ErrorMessage message="Property not found" />;

  const images = property.images || (property.image ? [property.image] : []);
  const mainImage = images[selectedImage] || 'https://via.placeholder.com/800x600?text=No+Image';

  // Payment plans based on property price
  const fullPrice = typeof property.price === 'number' ? property.price : parseInt(String(property.price));
  const installmentPlans = [
    {
      name: 'Outright Payment',
      description: 'Pay full amount and get instant allocation',
      amount: fullPrice,
      discount: '5% discount',
      duration: 'Immediate'
    },
    {
      name: '6 Months Plan',
      description: 'Spread payment over 6 months',
      amount: Math.ceil(fullPrice * 1.05 / 6),
      monthly: true,
      duration: '6 months',
      total: Math.ceil(fullPrice * 1.05)
    },
    {
      name: '12 Months Plan',
      description: 'Affordable monthly payments',
      amount: Math.ceil(fullPrice * 1.10 / 12),
      monthly: true,
      duration: '12 months',
      total: Math.ceil(fullPrice * 1.10)
    }
  ];

  const features = [
    { icon: Home, label: 'Property Type', value: property.type },
    { icon: MapPin, label: 'Location', value: property.location },
    { icon: Maximize, label: 'Size', value: property.size },
    { icon: CheckCircle, label: 'Status', value: property.status }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-green-500 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Properties</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-96 bg-slate-200">
                <img
                  src={mainImage}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.status === 'Sold' && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                    SOLD OUT
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="p-4 grid grid-cols-4 gap-4">
                  {images.slice(0, 4).map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-green-500 scale-105' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{property.title}</h1>
              <p className="text-2xl font-bold text-green-500 mb-6">
                ₦{fullPrice.toLocaleString()}
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <feature.icon className="text-green-500" size={24} />
                    <div>
                      <p className="text-sm text-gray-500">{feature.label}</p>
                      <p className="font-semibold text-slate-800">{feature.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">About This Property</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {property.description || 'This is a prime property in an excellent location with great potential for investment and development.'}
                </p>

                <h3 className="text-lg font-bold text-slate-900 mb-3">Key Features:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Clean and verified title documents (C of O/Gazette)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Strategic location with easy accessibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Dry and table land ready for development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Free from government acquisition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>24/7 security in the estate</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
                    <span>Proximity to major amenities and landmarks</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Payment Plans */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Plans</h2>
              <div className="space-y-4">
                {installmentPlans.map((plan, index) => (
                  <div
                    key={index}
                    className="border-2 border-slate-200 rounded-xl p-6 hover:border-green-500 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                        <p className="text-gray-600 text-sm">{plan.description}</p>
                      </div>
                      {plan.discount && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                          {plan.discount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-500">
                        ₦{plan.amount.toLocaleString()}
                      </span>
                      {plan.monthly && <span className="text-gray-500">/month</span>}
                    </div>
                    {plan.total && (
                      <p className="text-sm text-gray-500 mt-2">
                        Total: ₦{plan.total.toLocaleString()} over {plan.duration}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Initial deposit of 30% required for all installment plans. 
                  Contact us for customized payment arrangements.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Interested in this property?</h3>
              
              <button
                onClick={() => router.push('/contact')}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg mb-4 transition-colors"
              >
                Schedule Inspection
              </button>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="text-green-500" size={20} />
                  <div>
                    <p className="font-semibold text-slate-900">Call Us</p>
                    <p>+234 803 268 5820 <br /> +234 805 553 4025</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="text-green-500" size={20} />
                  <div>
                    <p className="font-semibold text-slate-900">Email</p>
                    <p>info@zahbestates.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="text-green-500" size={20} />
                  <div>
                    <p className="font-semibold text-slate-900">Office Hours</p>
                    <p>Mon-Fri: 9AM - 6PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Property ID: {property._id?.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h4 className="font-bold text-slate-900 mb-3">Why Choose ZAHB Estates?</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                  <span>Verified and documented properties</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                  <span>Flexible payment options</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                  <span>Professional estate management</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                  <span>After-sales support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetailsPage;
