const User = require("../models/User");

// @desc    Get current logged-in user
// @route   GET /api/user/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getMe:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getUploadedDocs = async(req, res) => {
  try {
    // Extract customerEmail from request parameters
    const email = req.params.customerEmail;
  
    // Find user by customerEmail
    const userData = await User.findOne({ email: email });

    if (!userData) {
  console.error('User not found');
  return res.status(404).json({ message: 'User not found' });
}
   if(!userData.UploadedDocuments || userData.UploadedDocuments.length === 0) {
     return res.status(200).json({
        success: true,
        message: "No Documents ",
        count: 0,
        data: []  // Explicit array of documents
    });
   }
  
    // Explicitly ensure we're working with an array
    const docsArray = Array.isArray(userData.UploadedDocuments) ? userData.UploadedDocuments : [userData.UploadedDocuments];

    // Return the array with success status
    res.status(200).json({
        success: true,
        message: "Documents fetched successfully",
        count: docsArray.length,
        data: docsArray  // Explicit array of documents
    });

  } catch (error) {
    console.error("Fetch Documents Error:", error);
    res.status(500).json({
        success: false,
        message: "Error fetching documents",
        error: error.message,
        data: []  // Explicit empty array on error
    });
  }
};

module.exports = { getMe, getUploadedDocs};
