const profileServices = require("../services/profileService");

const profileCtrl = {
  createProfile: async (req, res, next) => {
    const result = await profileServices.createProfile(req, next);
    if (!result) return;
    res.status(200).json({ msg: "Create Profile Success", result });
  },
  changeStatusProfile: async (req, res, next) => {
    const result = await profileServices.changeStatusProfile(req, next);
    if (!result) return;
    res.status(200).json({ msg: "Change Status Profile Success", result });
  },
  getAllProfiles: async (req, res, next) => {
    const result = await profileServices.getAllProfiles(req, next);
    if (!result) return;
    res.status(200).json({ msg: "Get All Profiles Success", result });
  },
  changeStepProfile: async (req, res, next) => {
    const result = await profileServices.changeStepProfile(req, next);
    if (!result) return;
    res.status(200).json({ msg: "Chang Step Profile Success", result });
  },
  getProfileById: async (req, res, next) => {
    const result = await profileServices.getProfileById(req, next);
    if (!result) return;
    res.status(200).json({ msg: "Get Profile Success", result });
  },
  countProfiles: async (req, res, next) => {
    const result = await profileServices.countProfiles(req, next);
    if (!result) return;
    res.status(200).json({ msg: "Count Profiles Of Month Success", result });
  },
};

module.exports = profileCtrl;
