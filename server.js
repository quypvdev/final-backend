const app = require("./app");

const http = require("http").createServer(app);

const port = process.env.PORT || 5000;

http.listen(port, () => {
  console.log("Server is running on port ", port);
});
