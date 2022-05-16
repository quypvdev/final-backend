const Profiles = require("../models/profileModel");
const Campaigns = require("../models/campaignModel");
const { profileValidateCreate } = require("../helpers/validation");
const createError = require("http-errors");
const APIFeatures = require("../helpers/feature");
const {
  sendEmailApplySuccess,
  sendEmailRejectCV,
  sendEmailRejectPhase,
  sendEmailStatusTest,
  sendEmailStatusInterview,
  sendEmailStatusPass,
} = require("../services/mailService");
const cloudinary = require("cloudinary").v2;
const { uploadfile } = require("../services/upload.file");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const profileServices = {
  createProfile: async (req, next) => {
    try {
      const { error } = profileValidateCreate(req.body);
      if (error) {
        throw createError.BadRequest(error.details[0].message);
      }
      const { fullname, email, phone, detail, id } = req.body;
      const link = await uploadfile(req);
      const pdf = `http://drive.google.com/uc?export=view&id=${link.data.id}`;

      const img = await cloudinary.uploader.upload(req.files.image[0].path);

      if (!img) {
        throw createError.BadRequest("Upload image failed");
      }

      const newProfile = new Profiles({
        fullname,
        email,
        phone,
        detail,
        campaignId: id,
        avatar: img.secure_url,
        cv: pdf,
      });

      await Campaigns.findOneAndUpdate(
        { _id: id },
        {
          $push: { profiles: newProfile._id },
        },
        { new: true }
      );

      await sendEmailApplySuccess({ toUser: newProfile });

      return await newProfile.save();
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  changeStatusProfile: async (req, next) => {
    try {
      const { position } = req.body;

      const change = async () => {
        const result = await Profiles.findByIdAndUpdate(
          req.params.id,
          {
            $set: { status: req.body.status },
          },
          { new: true }
        ).populate("campaignId");

        if (!result) throw createError.NotFound("Profile not found");
        return result;
      };

      const res = await Profiles.findById(req.params.id);

      switch (req.body.status) {
        case "processing":
          const processing = await change();
          return processing;
        case "passed":
          const passed = await await change();
          const a = await sendEmailStatusPass({ toUser: passed, position });
          console.log(a);
          return passed;
        case "failed":
          const failed = await await change();
          return failed;

        default:
          break;
      }
    } catch (error) {
      next(error);
    }
  },
  getAllProfiles: async (req, next) => {
    try {
      const search = req.query.search;
      const step = req.query.step;
      const status = req.query.status;

      const features = new APIFeatures(
        Profiles.find({
          $and: [
            {
              $or: [
                { fullname: { $regex: new RegExp(search), $options: "i" } },
                { email: { $regex: new RegExp(search), $options: "i" } },
                {
                  phone: { $regex: new RegExp(search) },
                },
                {
                  step: { $regex: new RegExp(search), $options: "i" },
                },
                {
                  status: { $regex: new RegExp(search), $options: "i" },
                },
                { detail: { $regex: new RegExp(search), $options: "i" } },
              ],
            },
            {
              $or: [
                { step: { $regex: new RegExp(step), $options: "i" } },
                {
                  status: { $regex: new RegExp(status), $options: "i" },
                },
              ],
            },
            {
              $or: [
                {
                  $and: [
                    { step: { $regex: new RegExp(step), $options: "i" } },
                    {
                      status: { $regex: new RegExp(status), $options: "i" },
                    },
                  ],
                },
              ],
            },
          ],
        }).populate("campaignId", "title position"),
        req.query
      )
        .paginating()
        .sorting();

      const result = await Promise.allSettled([
        features.query,
        Profiles.countDocuments(),
      ]);
      const profiles = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[0].status === "fulfilled" ? result[0].value.length : 0;
      const total = result[1].status === "fulfilled" ? result[1].value : 0;

      if (!profiles) {
        throw createError.NotFound("Not found");
      }
      return {
        profiles,
        total: search || step || status ? count : total,
        page: Number(req.query.page) || 1,
      };
    } catch (error) {
      next(error);
    }
  },
  changeStepProfile: async (req, next) => {
    try {
      const { linkDateTime, valueReject } = req.body;

      const change = async () => {
        const result = await Profiles.findByIdAndUpdate(
          req.params.id,
          {
            $set: { step: req.body.step },
          },
          { new: true }
        ).populate("campaignId");

        if (!result) throw createError.NotFound("Profile not found");
        return result;
      };

      const res = await Profiles.findById(req.params.id);

      switch (req.body.step) {
        case "new":
          // if (res.status === "test") {
          //   throw createError.BadRequest("Profile is already test");
          // }
          const cvnew = await change();
          return cvnew;
        case "test":
          const test = await change();
          await sendEmailStatusTest({ toUser: test, linkDateTime });
          return test;
        case "interview":
          const interview = await change();
          await sendEmailStatusInterview({ toUser: interview, linkDateTime });
          return interview;
        case "confirm":
          const confirm = await change();
          return confirm;
        case "consider":
          const consider = await change();
          return consider;
        case "employee":
          const employee = await change();
          return employee;
        case "reject":
          if (valueReject === 1) {
            const reject = await change();
            await sendEmailRejectCV({ toUser: reject });
            return reject;
          } else {
            const rejectPhase = await change();
            await sendEmailRejectPhase({ toUser: rejectPhase });
            return rejectPhase;
          }
        default:
          break;
      }
    } catch (error) {
      next(error);
    }
  },
  getProfileById: async (req, next) => {
    try {
      const result = await Profiles.findById(req.params.id).populate(
        "campaignId"
      );
      if (!result) throw createError.NotFound("Profile not found");
      return result;
    } catch (error) {
      next(error);
    }
  },
  countProfiles: async (req, next) => {
    try {
      const profiles = await Profiles.find({});
      const count = profiles.filter((profile) => {
        const date = new Date(profile.createdAt);
        const month = date.getMonth();
        const year = date.getFullYear();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        if (month === currentMonth && year === currentYear) {
          return profile;
        }
      });

      //countAccept
      const countAccept = profiles.filter((profile) => {
        if (profile.status === "passed") {
          return profile;
        }
      });
      //countProcessing
      const countProcessing = profiles.filter((profile) => {
        if (profile.status === "processing") {
          return profile;
        }
      });

      //countReject
      const countReject = profiles.filter((profile) => {
        if (profile.status === "failed") {
          return profile;
        }
      });

      return {
        allprofile: profiles.length,
        profileOfMonth: count.length,
        profileAccept: countAccept.length,
        profileProcessing: countProcessing.length,
        profileReject: countReject.length,
      };
    } catch (error) {
      next(error);
    }
  },
};

module.exports = profileServices;
