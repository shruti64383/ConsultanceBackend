const User = require("../models/User");
const Leads = require("../models/Leads")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getAllLeads = async (req, res) => {
    try {
        // Fetch all leads - find() always returns an array
        const leads = await Leads.find({}).sort({ date: -1 }); // Sort by date descending
        
        // Explicitly ensure we're working with an array
        const leadsArray = Array.isArray(leads) ? leads : [leads];
        
        // Return the array with success status
        res.status(200).json({
            success: true,
            message: "Leads fetched successfully",
            count: leadsArray.length,
            data: leadsArray  // Explicit array of leads
        });
        
    } catch (error) {
        console.error("Fetch Leads Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching leads",
            error: error.message,
            data: []  // Explicit empty array on error
        });
    }
};

exports.getLeadById = async (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = await Leads.findOne({ leadId: leadId });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Lead fetched successfully",
      data: lead
    });
  } catch (error) {
    console.error("Fetch Lead Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lead",
      error: error.message
    });
  }
};

exports.updateLeadPriority = async (req, res) => {
  try {
    const { leadId } = req.body;
    const { priority } = req.body; // Expecting { priority: "high" }

    const updatedLead = await Leads.findOneAndUpdate(
      { leadId },
      { priority },
      { new: true}
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Priority updated successfully",
      data: updatedLead
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating priority",
      error: error.message
    });
  }
};

exports.deleteLeadById = async (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = await Leads.findOne({ leadId: leadId });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    await Leads.deleteOne({ leadId: leadId });

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully"
    });
  } catch (error) {
    console.error("Delete Lead Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting lead",
      error: error.message
    });
  }
};

exports.updateLeadStatus = async (req, res) => {
  try {
    const { leadId } = req.body;
    const { status } = req.body; // Expecting { priority: "high" }

    const updatedLead = await Leads.findOneAndUpdate(
      { leadId },
      { status },
      { new: true}
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Priority updated successfully",
      data: updatedLead
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating priority",
      error: error.message
    });
  }
};

       

 
