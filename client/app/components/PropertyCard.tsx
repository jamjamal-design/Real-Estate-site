'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Edit, Trash2 } from 'lucide-react';

type Property = {
  _id?: string;
  id?: number;
  title: string;
  type: string;
  price: number | string;
  location: string;
  size: string;
  description?: string;
  images?: string[];
  image?: string;
  status: string;
};

type PropertyCardProps = {
  property: Property;
  isAdmin?: boolean;
  onDelete?: (id: string | number) => void;
  onEdit?: (property: Property) => void;
};

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  isAdmin = false, 
  onDelete, 
  onEdit 
}) => {
  const router = useRouter();
  const propertyId = property._id || property.id;
  const propertyImage = property.images?.[0] || property.image || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000';
  const displayPrice = typeof property.price === 'number' ? `₦${property.price.toLocaleString()}` : property.price;

  const handleViewDetails = () => {
    if (propertyId) {
      router.push(`/properties/${propertyId}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={propertyImage} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <span 
          className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${
            property.status === 'Available' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {property.status}
        </span>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-slate-800">{property.title}</h3>
          <p className="text-green-600 font-bold">{displayPrice}</p>
        </div>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <MapPin size={16} className="mr-1" />
          {property.location}
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
          <span>{property.type}</span>
          <span className="font-semibold">{property.size}</span>
        </div>
        
        {isAdmin ? (
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => onEdit?.(property)}
              className="flex-1 py-2 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Edit size={16} /> Edit
            </button>
            <button 
              onClick={() => propertyId && onDelete?.(propertyId)}
              className="flex-1 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        ) : (
          <button 
            onClick={handleViewDetails}
            className="w-full mt-4 py-2 border-2 border-slate-900 text-slate-900 font-semibold rounded hover:bg-slate-900 hover:text-white transition-colors"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
