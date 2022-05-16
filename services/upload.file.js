const { google } = require("googleapis");
const fs = require("fs");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESHTOKEN = process.env.REFRESHTOKEN;

const authClient = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
authClient.setCredentials({ refresh_token: REFRESHTOKEN });

const drive = google.drive({
  version: "v3",
  auth: authClient,
});

var self = (module.exports = {
  setFilePublic: async (fileId) => {
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      const getUrl = await drive.files.get({
        fileId,
        fields: "webViewLink, webContentLink, id ",
      });

      return getUrl;
    } catch (error) {}
  },
  uploadfile: async (req) => {
    try {
      const fileMetadata = {
        name: req.files.pdf[0].originalname,
      };
      const media = {
        mimeType: req.files.mimetype,
        body: fs.createReadStream(req.files.pdf[0].path),
      };
      const createFile = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
      });
      const fileId = createFile.data.id;
      const getUrl = await self.setFilePublic(fileId);

      return getUrl;
    } catch (error) {
      console.log(error);
    }
  },
});
