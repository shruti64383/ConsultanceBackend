const mongoose = require("mongoose");

const complianceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    dueDate: { type: Date, required: true },
    remarks: { type: String, default: '' },
}, { timestamps: true });

const Compliance = mongoose.model("Compliance", complianceSchema);
module.exports = Compliance;
