require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/property/Property');

const sampleProperties = [
  {
    title: "Green Valley Estate",
    type: "Land",
    price: 4500000,
    location: "Epe, Lagos",
    size: "2 Acres",
    description: "Prime agricultural land with direct access to major roads. Perfect for farming or residential development.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800", "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800"],
    status: "Available"
  },
  {
    title: "Lekki Gardens Phase 3",
    type: "House",
    price: 8500000,
    location: "Lekki, Lagos",
    size: "600 sqm",
    description: "Premium residential plot in a serene gated estate. Full infrastructure with 24/7 security.",
    images: ["https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800", "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"],
    status: "Available"
  },
  {
    title: "Ibeju-Lekki Commercial Hub",
    type: "Land",
    price: 12000000,
    location: "Ibeju-Lekki, Lagos",
    size: "1000 sqm",
    description: "Strategic commercial land near the proposed 4th Mainland Bridge. High ROI potential.",
    images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"],
    status: "Available"
  },
  {
    title: "Sunrise Farmland",
    type: "Farm",
    price: 6200000,
    location: "Ikorodu, Lagos",
    size: "5 Acres",
    description: "Fertile farmland with natural water source. Suitable for crop cultivation and livestock.",
    images: ["https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800", "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800"],
    status: "Available"
  },
  {
    title: "Victoria Island Luxury Plot",
    type: "House",
    price: 25000000,
    location: "Victoria Island, Lagos",
    size: "450 sqm",
    description: "Exclusive residential plot in prime VI location. Close to business districts and amenities.",
    images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"],
    status: "Sold"
  }
];

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/real-estate')
  .then(async () => {
    
    
    // Clear existing properties
    await Property.deleteMany({});
    
    
    // Insert sample properties
    const inserted = await Property.insertMany(sampleProperties);
    
    
    
    inserted.forEach(prop => {
      console.log(`✅ Added: ${prop.title} - ₦${prop.price.toLocaleString()}`);
    });
    
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
