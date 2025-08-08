// const mongoose = require('mongoose'); // ✅ correct spelling

// const { string } = require('zod');

// const serviceRequestSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         ref: 'User' // Reference to User model
//     },
//     serviceName: {
//         type:String,
//         required: true
//     },
//     status:{
//         type: String,
//         enum: ['Pending', 'Approved', 'Rejected'],
//         default: 'Pending'
//     },
//     requestedAt: {
//         type: Date,
//         default: Date.now
//     },
// })

// module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
