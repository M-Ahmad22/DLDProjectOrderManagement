const mongoose = require("mongoose");

const projectOrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  universityId: { type: String, required: true },
  department: { type: String, required: true },
  contact: { type: String, required: true },
  type: {
    type: String,
    enum: ["Default", "Customised"],
    required: true,
  },
  projectName: {
    type: String,
    required: function () {
      return this.type === "Default";
    },
  },
  projectDetails: {
    type: String,
    required: function () {
      return this.type === "Customised";
    },
  },
  message: String,
  status: {
    type: String,
    default: "Pending",
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  dueAmount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ProjectOrder", projectOrderSchema);
