const { campaignValidateCreate } = require("../helpers/validation");
const createError = require("http-errors");
const Campaigns = require("../models/campaignModel");
const cloudinary = require("cloudinary").v2;
const APIFeatures = require("../helpers/feature");
const moment = require("moment");
const res = require("express/lib/response");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const campaignServices = {
  createCampaign: async (req, next) => {
    try {
      const { error } = campaignValidateCreate(req.body);
      if (error) {
        throw createError.BadRequest(error.details[0].message);
      }
      const {
        title,
        description,
        address,
        startDate,
        endDate,
        quantity,
        position,
        technology,
      } = req.body;
      const img = await cloudinary.uploader.upload(req.body.recfile);
      if (!img) {
        throw createError.BadRequest("Upload image failed");
      }
      const newCampaign = new Campaigns({
        title,
        description,
        address,
        startDate,
        endDate,
        quantity,
        position,
        technology: technology.split(","),
        image: img.secure_url,
      });
      return await newCampaign.save();
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  getAllCampaign: async (req, next) => {
    try {
      const position = req.query.position;
      const technology = req.query.technology;
      const search = req.query.search;
      const features = new APIFeatures(
        Campaigns.find({
          $and: [
            {
              $or: [
                { title: { $regex: new RegExp(search), $options: "i" } },
                { position: { $regex: new RegExp(search), $options: "i" } },
                {
                  description: { $regex: new RegExp(search), $options: "i" },
                },
                { address: { $regex: new RegExp(search), $options: "i" } },
                {
                  technology: { $regex: new RegExp(search), $options: "i" },
                },
              ],
            },
            {
              $or: [
                {
                  position: {
                    $regex: new RegExp([position]),
                    $options: "i",
                  },
                },
              ],
            },
            {
              $or: [
                {
                  technology: {
                    $regex: new RegExp(technology),
                    $options: "i",
                  },
                },
              ],
            },
            {
              $or: [
                {
                  $and: [
                    {
                      position: { $regex: new RegExp(position), $options: "i" },
                    },
                    {
                      technology: {
                        $regex: new RegExp(technology),
                        $options: "i",
                      },
                    },
                  ],
                },
              ],
            },
          ],
        }).sort({ active: -1 }),
        req.query
      )
        .paginating()
        .sorting();

      const result = await Promise.allSettled([
        features.query,
        Campaigns.countDocuments(),
      ]);
      const campaigns = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[0].status === "fulfilled" ? result[0].value.length : 0;
      const total = result[1].status === "fulfilled" ? result[1].value : 0;
      if (!campaigns) throw createError.NotFound("Campaign not found");

      return {
        campaigns,
        total: search || technology || position ? count : total,
        page: Number(req.query.page) || 1,
      };
    } catch (error) {
      next(error);
    }
  },
  getAllCampaignActive: async (req, next) => {
    try {
      const position = req.query.position;
      const technology = req.query.technology;
      const search = req.query.search;

      const features = new APIFeatures(
        Campaigns.find({
          $and: [
            {
              $or: [
                { title: { $regex: new RegExp(search), $options: "i" } },
                { position: { $regex: new RegExp(search), $options: "i" } },
                {
                  description: { $regex: new RegExp(search), $options: "i" },
                },
                { address: { $regex: new RegExp(search), $options: "i" } },
                {
                  technology: { $regex: new RegExp(search), $options: "i" },
                },
              ],
              active: true,
            },
            {
              $or: [
                {
                  position: {
                    $regex: new RegExp([position]),
                    $options: "i",
                  },
                },
              ],
              active: true,
            },
            {
              $or: [
                {
                  technology: {
                    $regex: new RegExp(technology),
                    $options: "i",
                  },
                },
              ],
              active: true,
            },
            {
              $or: [
                {
                  $and: [
                    {
                      position: { $regex: new RegExp(position), $options: "i" },
                    },
                    {
                      technology: {
                        $regex: new RegExp(technology),
                        $options: "i",
                      },
                    },
                  ],
                  active: true,
                },
              ],
            },
          ],
        }),
        req.query
      )
        .paginating()
        .sorting();

      const result = await Promise.allSettled([
        features.query,
        Campaigns.countDocuments(),
      ]);
      const campaigns = result[0].status === "fulfilled" ? result[0].value : [];
      const count =
        result[0].status === "fulfilled" ? result[0].value.length : 0;
      const total = (await Campaigns.find({ active: true })).length;

      if (!campaigns) {
        throw createError.NotFound("Not found");
      }
      console.log(count);

      return {
        campaigns,
        total: search || position || technology ? count : total,
        page: Number(req.query.page) || 1,
      };
    } catch (error) {
      next(error);
    }
  },
  updateCampaign: async (req, next) => {
    try {
      const {
        title,
        description,
        address,
        startDate,
        endDate,
        quantity,
        position,
        technology,
        status,
      } = req.body;

      console.log(status);

      const campaign = await Campaigns.findById(req.params.id);
      const { image } = campaign;
      const tmp = req.body.recfile;
      let img;

      if (!tmp) {
        img = image;
      } else {
        img = await cloudinary.uploader.upload(req.body.recfile);
      }

      const newCampaign = await Campaigns.findOneAndUpdate(
        { _id: req.params.id },
        {
          title,
          description,
          address,
          startDate,
          endDate,
          quantity,
          position,
          active: status,
          technology: technology.split(","),
          image: img.secure_url ? img.secure_url : image,
        },
        {
          new: true,
        }
      );
      if (!newCampaign) throw createError.BadRequest("Campaign not found");
      return newCampaign;
    } catch (error) {
      console.log(error);
      next(error);
    }
  },
  disableCampaign: async (req, next) => {
    try {
      const newCampaign = await Campaigns.findOneAndUpdate(
        { _id: req.params.id },
        {
          active: false,
        },
        {
          new: true,
        }
      );
      if (!newCampaign) throw createError.BadRequest("Campaign not found");
      return newCampaign;
    } catch (error) {
      next(error);
    }
  },
  activeCampaign: async (req, next) => {
    try {
      const newCampaign = await Campaigns.findOneAndUpdate(
        { _id: req.params.id },
        {
          active: true,
        },
        {
          new: true,
        }
      );
      if (!newCampaign) throw createError.BadRequest("Campaign not found");
      return newCampaign;
    } catch (error) {
      next(error);
    }
  },
  getCampaignById: async (req, next) => {
    try {
      const campaign = await Campaigns.findById(req.params.id).populate(
        "profiles"
      );
      if (!campaign) throw createError.BadRequest("Campaign not found");
      return campaign;
    } catch (error) {
      console.log(error);
    }
  },
  updateCampaignDisable: async (req, next) => {
    try {
      const campaigns = await Campaigns.find({});
      campaigns.forEach(async (campaign) => {
        if (campaign.endDate < new Date()) {
          const res = await Campaigns.findByIdAndUpdate(campaign._id, {
            active: false,
          });
        }
      });
      return "Success";
    } catch (error) {
      next(error);
    }
  },
  countCampaignOfMonth: async (req, next) => {
    try {
      const campaigns = await Campaigns.find({});
      const count = campaigns.filter((campaign) => {
        const date = new Date(campaign.startDate);
        const month = date.getMonth();
        const year = date.getFullYear();
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        if (month === currentMonth && year === currentYear) {
          return campaign;
        }
      });
      return count.length;
    } catch (error) {
      next(error);
    }
  },
};

module.exports = campaignServices;
