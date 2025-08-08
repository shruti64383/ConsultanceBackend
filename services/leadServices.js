 
const { mongoose, connectDB } = require('../config/db');
const Leads = require('../models/Leads');

console.log('Mongoose instance ID:', require('mongoose').instanceId);
// Should be the same across all files

//import mongoose from 'mongoose';

// Add this at the start of `getAllLeads` or in a global init file
// const connectDB = async () => {
//   if (mongoose.connection.readyState === 0) { // 0 = disconnected
//     await mongoose.connect(process.env.MONGODB_URI);
//   }
// };

async function getAllLeads() {
    try {
        
console.log(`Connection state in leadServices: ${mongoose.connection.readyState}`);
// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        if (mongoose.connection.readyState !== 1) {
            console.log('Database not connected');
            return [];
        }

        const leads = await Leads.find({}).maxTimeMS(30000); // Increase timeout to 30s
        
        return Array.isArray(leads) ? leads : [leads];
    } catch (error) {
        console.error('Error fetching leads:', error);
        return []; // Or handle it as per your error handling strategy
    }
}

// export const LeadService = {
//   // Get all leads (newest first)
//   getAllLeads: async () => {
//     try {
//       //await connectDB(); 
//       console.log("jata hu")
//       const results = await Leads.find()
//         .sort({ date: -1 })
//         .lean()
//         .exec();
//       console.log("Mongoose query results:", results);
//       // Explicitly ensure it's an array (safest approach)
//       return Array.isArray(results) ? results : [];
//     } catch (error) {
//       console.log("yha hu");
//       console.error("Error fetching leads:", error);
//       return []; // Fallback to empty array on error
//     }
//   },

//   // Delete lead by ID
//   deleteLead: async (id) => {
//     //await connectDB();
//     const result = await Leads.findByIdAndDelete(id);
//     return { deleted: !!result };
//   },

//   // Update specific fields
//   patchLead: async (id, updates) => {
//     //await connectDB();
//     return Leads.findByIdAndUpdate(
//       id,
//       { $set: updates },
//       { new: true } // Return updated doc
//     ).lean();
//   }
// };

module.exports = {
    getAllLeads
    // Add other lead-related service functions here
};