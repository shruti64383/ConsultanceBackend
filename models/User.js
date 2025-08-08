const mongoose = require("mongoose")
const bcrypt = require("bcryptjs") // ✅ import bcrypt
//const { UploadDocuments } = require("../../user/components/upload-documents")

const paymentSchema = new mongoose.Schema({
  service: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
})

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  services: [
    {
      type: String,
    },
  ],
  UploadedDocuments: [
    {
      type: [String],
      default: []
    },
  ],
  payments: [paymentSchema],
})

/**
 * ✅ Pre-save hook to hash password
 */
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    return next(err)
  }
})

const User = mongoose.model("User", userSchema)
module.exports = User
