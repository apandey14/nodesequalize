
const express = require("express");
const router = express.Router();
const excelController = require("../controllers/candidate/excel.controller");
const upload = require("../middlewares/upload");

let routes = (app) => {
  router.post("/upload", upload.single("file"), excelController.upload);
 

  app.use("/api/excel", router);

  };

  module.exports = routes;