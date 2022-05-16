const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    cv: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
    },
    step: {
      type: String,
      default: "new",
    },
    status: {
      type: String,
      default: "processing",
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGst_d8V36RXaFOACCqTp7AVi6dz-7X2KQQQ&usqp=CAU",
    },
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", profileSchema);
