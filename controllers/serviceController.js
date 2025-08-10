const User = require("../models/User");
const Customers = require("../models/Customers");
const Services = require("../models/Services");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.addService = async (req, res) => {
    const { customerId } = req.params; // Get customerId from URL parameters
    const customer = await Customers.findOne({ customerId });
    const { name, price, description, requiredDocuments, certificates } = req.body;
    try {
        const service = await Services.create({ customerId, customerEmail: customer.email, name, price, description, requiredDocuments, certificates });

        const updatedCustomer = await Customers.findOneAndUpdate(
            { customerId },
            { $push: { services: service.name } },  
            { new: true }  
        ) 

        if (!updatedCustomer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        res.status(201).json({ 
            msg: "Service created and added to customer successfully",
            service,
            customer: updatedCustomer
        })

        //res.status(201).json({ msg: "Service Created Successfully", service });
    } catch (error) {
        console.error("Service Creation Error:", error);
        res.status(500).json({ msg: "Error creating service", error: error.message });
    }
};


exports.getAllServices = async (req, res) => {
    try {
        
        const { customerId } = req.params; // Get customerId from URL parameters

        console.log("finding for customerId:", customerId, " type: ", typeof customerId);

        // Fetch all services for a specific customer
        const services = await Services.find({ customerId }).sort({ startDate: -1 });

        // Explicitly ensure we're working with an array
        const servicesArray = Array.isArray(services) ? services : [services];

        // Return the array with success status
        res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            count: servicesArray.length,
            data: servicesArray  // Explicit array of services
        });
        
    } catch (error) {
        console.error("Fetch Services Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching services",
            error: error.message,
            data: []  // Explicit empty array on error
        });
    }
};

exports.getAllServicesForDashboard = async (req, res) => {
    try {
        // Fetch all services for a specific customer
        const services = await Services.find({}).sort({ startDate: -1 });

        // Explicitly ensure we're working with an array
        const servicesArray = Array.isArray(services) ? services : [services];

        // Return the array with success status
        res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            count: servicesArray.length,
            data: servicesArray  // Explicit array of services
        });
        
    } catch (error) {
        console.error("Fetch Services Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching services",
            error: error.message,
            data: []  // Explicit empty array on error
        });
    }
};

exports.getAllServicesByEmail = async (req, res) => {
    try {
        // Fetch all services for a specific customer
        const customer = req.params.customerEmail;

        //const customerData = await Customers.findOne({ email: customer });
        const services = await Services.find({ customerEmail: customer }).sort({ startDate: -1 });

        // Explicitly ensure we're working with an array
        const servicesArray = Array.isArray(services) ? services : [services];

        // Return the array with success status
        res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            count: servicesArray.length,
            data: servicesArray  // Explicit array of services
        });
        
    } catch (error) {
        console.error("Fetch Services Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching services",
            error: error.message,
            data: []  // Explicit empty array on error
        });
    }
};


exports.getAllServiceDocsByEmail = async (req, res) => {
    try {
        // Fetch all services for a specific customer
        const customer = req.params.customerEmail;

        //const customerData = await Customers.findOne({ email: customer });
        const services = await Services.find({ customerEmail: customer }).sort({ startDate: -1 }).limit(2)
       .select('name requiredDocuments certificates');

        // Explicitly ensure we're working with an array
        //const servicesArray = Array.isArray(services) ? services : [services];
        const processedServices = services.map(service => ({
          serviceName: service.name,
          mergedArray: [...service.requiredDocuments, ...service.certificates]
   }));

        // Return the array with success status
        res.status(200).json({
            success: true,
            message: "Services fetched successfully",
            count: processedServices.length,
            data: processedServices  // Explicit array of services
        });
        
    } catch (error) {
        console.error("Fetch Services Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching services",
            error: error.message,
            data: []  // Explicit empty array on error
        });
    }
};

// exports.getLeadById = async (req, res) => {
//   try {
//     const { leadId } = req.params;
//     const lead = await Leads.findOne({ leadId: leadId });

//     if (!lead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Lead fetched successfully",
//       data: lead
//     });
//   } catch (error) {
//     console.error("Fetch Lead Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching lead",
//       error: error.message
//     });
//   }
// };

// exports.updateLeadPriority = async (req, res) => {
//   try {
//     const { leadId } = req.body;
//     const { priority } = req.body; // Expecting { priority: "high" }

//     const updatedLead = await Leads.findOneAndUpdate(
//       { leadId },
//       { priority },
//       { new: true}
//     );

//     if (!updatedLead) {
//       return res.status(404).json({
//         success: false,
//         message: "Lead not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Priority updated successfully",
//       data: updatedLead
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating priority",
//       error: error.message
//     });
//   }
// };

exports.deleteServiceById = async (req, res) => {
  try {
    const { serviceId, customerId } = req.params;
    const service = await Services.findOne({ serviceId: serviceId });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    const updatedCustomer = await Customers.findOneAndUpdate(
            { customerId },
            { $pull: { services: service.name } },  
            { new: true }  
        ) 

    await Services.deleteOne({ serviceId: serviceId });

    res.status(200).json({
      success: true,
      message: "Service deleted successfully"
    });
  } catch (error) {
    console.error("Delete Service Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting service",
      error: error.message
    });
  }
};

exports.updateServiceStatus = async (req, res) => {
  try {
    const { serviceId } = req.params; // Get customerId from URL parameters
    const { status } = req.body; // Expecting { priority: "high" }

    const updatedService = await Services.findOneAndUpdate(
      { serviceId: serviceId },
      { status },
      { new: true}
    );

    if(status == "completed") {
      updatedService.completedDate = new Date();
      updatedService.progress = 100; // Set progress to 100% when completed
      await updatedService.save();
    }else if(status == "in progress") {
      updatedService.completedDate = null; // Reset completedDate when in progress
      updatedService.progress = 70; // Set progress to 50% when in progress
      await updatedService.save();
    }else if(status == "not started") {
      updatedService.completedDate = null; // Reset completedDate when not started
      updatedService.progress = 0; // Reset progress to 0% when not started
      await updatedService.save();
    }else{
      updatedService.completedDate = null; // Reset completedDate when under review
      updatedService.progress = 30; // Set progress to 30% when under review
      await updatedService.save();
    }

    if (!updatedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedService
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating priority",
      error: error.message
    });
  }
};