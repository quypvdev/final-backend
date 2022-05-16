exports.errorHandle = (err, req, res, next) => {
  err.status = err.status || 500;

  //   //Dupicate key error
  //   if (err.code === 11000) {
  //     err.status = 400;
  //     for (let p in err.keyValue) {
  //       err.message = `${p} have to be uique`;
  //     }
  //   }

  //ObjectId: not found
  // if (err.kind == "ObjectId") {
  //   err.status = 404;
  //   err.message = `Id not found`;
  // }

  return res.status(err.status).json({ msg: err.message });
};
