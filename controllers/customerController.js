const User = require("../models/User");
const Leads = require("../models/Leads")
const Customers = require("../models/Customers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.addCustomer = async (req, res) => {
    const { name, email, phone, service, priority } = req.body; 
    //const servicesArray = typeof service === 'string' ? [service] : Array.isArray(service) ? service : [];
    try {

        // const user = await Customers.create({ name, email, phone, services: servicesArray, priority }); // no hashing here
        const user = await Customers.create({ name, email, phone, priority }); // no hashing here
        res.status(201).json({ msg: "Customer Created Successfully" });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ msg: "Error registering user", error: error.message });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        // Fetch all customers - find() always returns an array
        const customers = await Customers.find({});
        
        // Explicitly ensure we're working with an array
        const customersArray = Array.isArray(customers) ? customers : [customers];
        
        // Return the array with success status
        res.status(200).json({
            success: true,
            message: "Customers fetched successfully",
            count: customersArray.length,
            data: customersArray  // Explicit array of customers
        });
        
    } catch (error) {
        console.error("Fetch Customers Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching customers",
            error: error.message,
            data: []  // Explicit empty array on error
        });
    }
};

exports.updateCustomerPriority = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { priority } = req.body; // Expecting { priority: "high" }

    const updatedCustomer = await Customers.findOneAndUpdate(
      { customerId },
      { priority },
      { new: true}
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Priority updated successfully",
      data: updatedCustomer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating priority",
      error: error.message
    });
  }
};

exports.deleteCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customers.findOne({ customerId: customerId });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    await Customers.deleteOne({ customerId: customerId });

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully"
    });
  } catch (error) {
    console.error("Delete Customer Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting customer",
      error: error.message
    });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const { customerId } = req.params;
    const customer = await Customers.findOne({ customerId: customerId });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer fetched successfully",
      data: customer
    });
  } catch (error) {
    console.error("Fetch Customer Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching customer",
      error: error.message
    });
  }
};

exports.getCustomerByEmail = async (req, res) => {
  console.log('Request received for email:', req.params.email); 
  try {
    const { email } = req.params;
    console.log("Searching for email:", email);
    
    const customer = await Customers.findOne({ email: email });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer fetched successfully",
      data: customer
    });
  } catch (error) {
    console.error("Fetch Customer Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching customer",
      error: error.message
    });
  }
};

exports.updateCustomerStatus = async (req, res) => {
  try {
    const { customerId } = req.body;
    const { status } = req.body; // Expecting { priority: "high" }

    const updatedCustomer = await Customers.findOneAndUpdate(
      { customerId },
      { status },
      { new: true}
    );

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updatedCustomer
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating priority",
      error: error.message
    });
  }
};
