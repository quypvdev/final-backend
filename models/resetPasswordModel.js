const mongoose = require("mongoose");

const resetSchema = new mongoose.Schema(
  {
    profileId: mongoose.Types.ObjectId,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("resetPassword", resetSchema);
