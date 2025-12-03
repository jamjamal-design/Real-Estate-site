require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/property/Property');

const additionalProperties = [
  {
    title: "Agro Valley Farmland",
    type: "Farm",
    price: 3800000,
    location: "Mowe, Ogun State",
    size: "3 Acres",
    description: "Expansive farmland ideal for poultry, fish farming, or crop cultivation. Rich soil with natural drainage. Direct access to Mowe-Ibafo expressway.",
    images: [
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800"
    ],
    status: "Available"
  },
  {
    title: "Riverside Agricultural Estate",
    type: "Farm",
    price: 7500000,
    location: "Sagamu, Ogun State",
    size: "6 Acres",
    description: "Premium agricultural land with river access. Perfect for large-scale farming operations. Includes existing irrigation system and storage facility.",
    images: [
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?w=800",
      "https://images.unsplash.com/photo-1625246222290-02b20f64e93f?w=800"
    ],
    status: "Available"
  },
  {
    title: "Green Acres Organic Farm",
    type: "Farm",
    price: 5200000,
    location: "Arepo, Ogun State",
    size: "4 Acres",
    description: "Certified organic farmland with fertile soil and excellent water table. Suitable for organic vegetable farming and sustainable agriculture projects.",
    images: [
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800"
    ],
    status: "Available"
  },
  {
    title: "Heritage Ranch Estate",
    type: "Farm",
    price: 9800000,
    location: "Epe, Lagos",
    size: "8 Acres",
    description: "Large estate perfect for livestock rearing and mixed farming. Includes existing structures, fencing, and borehole. Security post and staff quarters available.",
    images: [
      "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800",
      "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800"
    ],
    status: "Available"
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate')
  .then(async () => {
    
    
    const inserted = await Property.insertMany(additionalProperties);
    
    
    
    inserted.forEach(prop => {
       - ₦${prop.price.toLocaleString()}`);
    });
    
    const total = await Property.countDocuments();
    
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
