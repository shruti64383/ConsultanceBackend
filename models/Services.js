const mongoose = require("mongoose")
const Documents = require("./Documents");
 

const serviceSchema = new mongoose.Schema({
  // Auto-incremented unique ID
  serviceId: {
    type: Number,
    unique: true
  }, 

  customerId: {  // Reference to the owner customer
    type: Number,
    required: true,
    //index: true  // For faster queries
  },

  customerEmail: {
    type: String,
    required: true,
    //index: true  // For faster queries
  },

  // Required fields
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },

  price: {
    type: Number,
    min: [0, 'Price cannot be negative'],
    default: 0
  },

  // Status tracking
  status: {
    type: String,
    enum: ['not started', 'completed', 'in progress', 'under review'],
    default: 'not started'
  },

  progress: {
    type: Number,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot exceed 100'],
    default: 0 // Default progress is 0%
  },

  // Automatic timestamp
  startDate: {
    type: Date,
    default: Date.now
  },

  // Automatic timestamp
  completedDate: {
    type: Date,
    default: null
  },

  description: {
    type: String
  },

//   phone: {
//     type: String,
//     required: [true, 'Phone is required'],
//     match: [/^[\d\s\-()+]{10,20}$/, 'Please use a valid phone number']
//   },  
   
  
  // Service details
  requiredDocuments: {
  type: [String],  
  default: [] // Empty array as default
  },

  certificates: {
  type: [String],  
  default: [] // Empty array as default
  },

  uploadedDocuments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Documents',
      default: []
  },

//   totalSpent: {
//     type: Number,
//     min: [0, 'Total spent cannot be negative'],
//     default: 0
//   },

//   priority: {
//     type: String,
//     enum: ['low', 'medium', 'high'],
//     default: 'medium'
//   },
     
  
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

serviceSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const result = await Services.findOne()
      .sort('-serviceId') // Sort in descending order
      .select('serviceId') // Only select the leadId field
      .lean(); // Convert to plain JS object

    this.serviceId = result ? result.serviceId + 1 : 0;
    next();
  } catch (err) {
    next(err);
  }
});

const Services = mongoose.model("Services", serviceSchema);
module.exports = Services