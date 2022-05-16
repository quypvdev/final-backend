const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
    position: {
      type: String,
    },
    technology: {
      type: Array,
    },
    profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: "Profile" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);
