const multer = require("multer");

var storage = multer.diskStorage({
  destination: this.none,
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = upload;
