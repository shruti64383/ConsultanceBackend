const mongoose = require("mongoose")
const Services = require('./Services');
 

const customerSchema = new mongoose.Schema({
  // Auto-incremented unique ID
  customerId: {
    type: Number,
    unique: true
  }, 

  // Required fields
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
  },

  phone: {
    type: String,
    required: [true, 'Phone is required'],
    match: [/^[\d\s\-()+]{10,20}$/, 'Please use a valid phone number']
  },

  // Automatic timestamp
  date: {
    type: Date,
    default: Date.now
  },

  // Status tracking
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  
  // Service details
  services: {
    type: [String],
    default: []
  },

  totalSpent: {
    type: Number,
    min: [0, 'Total spent cannot be negative'],
    default: 0
  },

  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
   
  
  // // Additional info
  // message: {
  //   type: String,
  //   maxlength: [500, 'Message cannot exceed 500 characters']
  // },
  
   
   
  
  // // Business info
  // business: {
  //   type: String,
  //     enum: ['Small', 'Medium', 'Large', 'Enterprise'],
  //   default: 'Medium'
  //}
});

customerSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const result = await Customers.findOne()
      .sort('-customerId') // Sort in descending order
      .select('customerId') // Only select the leadId field
      .lean(); // Convert to plain JS object
     
    this.customerId = result ? result.customerId+1 : 0;
    next();
  } catch (err) {
    next(err);
  }
});

const Customers = mongoose.model("Customers", customerSchema);
module.exports = Customers