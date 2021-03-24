const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const app = express();

var corsOptions = {
  origin: "http://localhost:9081"
};

app.use(cors(corsOptions));

global.__basedir = __dirname + "/..";

app.use(express.urlencoded({ extended: true }));

db.sequelize.sync();
// // drop the table if it already exists
//db.sequelize.sync({ force: true }).then(() => {
    //console.log("Drop and re-sync db.");
  //});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

require("./routes/candidate.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 9080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});