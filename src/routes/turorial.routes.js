
const express = require("express");
const router = express.Router();
const excelController = require("../controllers/tutorials/excel.controller");
const upload = require("../middlewares/upload");

let routes = (app) => {
  router.post("/upload", upload.single("file"), excelController.upload);
  router.get("/Summarry", excelController.getSummarry);

  router.get("/download", excelController.download);

  app.use("/api/excel", router);

/*
//module.exports = app => {
    const candidate_summary = require("../controllers/tutorial.controller.js");
  
    var router = require("express").Router();
  
    // Create a new Tutorial
    router.post("/", candidate_summary.create);
  
    // Retrieve all Candidate
    router.get("/", candidate_summary.findAll);
  
    // Retrieve all published Candidate
    router.get("/published", candidate_summary.findAllPublished);
  
    // Retrieve a single Tutorial with id
    router.get("/:id", candidate_summary.findOne);
  
    // Update a Tutorial with id
    router.put("/:id", candidate_summary.update);
  
    // Delete a Tutorial with id
    router.delete("/:id", candidate_summary.delete);
  
    // Delete all Candidate
    router.delete("/", candidate_summary.deleteAll);
  
    app.use("/api/candidate_summary", router);*/
  };

  module.exports = routes;