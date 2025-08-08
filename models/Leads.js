const mongoose = require("mongoose")
 

const leadSchema = new mongoose.Schema({
  // Auto-incremented unique ID
  leadId: {
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
  
  // Service details
  service: {
    type: String,
    enum: ['Web Development', 'Consulting', 'Marketing', 'Design', 'Other'],
    default: 'Other'
  },
  budget: {
    type: Number,
    min: [0, 'Budget cannot be negative'],
    default: 0
  },
  
  // Automatic timestamp
  date: {
    type: Date,
    default: Date.now
  },
  
  // Additional info
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['new', 'contacted'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Business info
  business: {
    type: String,
      enum: ['Small', 'Medium', 'Large', 'Enterprise'],
    default: 'Medium'
  }
});

// Auto-increment leadId
leadSchema.pre('save', async function(next) {
  if (!this.isNew) return next();
  
  try {
    const result = await Leads.findOne()
      .sort('-leadId') // Sort in descending order
      .select('leadId') // Only select the leadId field
      .lean(); // Convert to plain JS object
     
    this.leadId = result ? result.leadId+1 : 0;
    next();
  } catch (err) {
    next(err);
  }
});

const Leads = mongoose.model("Leads", leadSchema);
module.exports = Leads