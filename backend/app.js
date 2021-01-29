require('dotenv').config();
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});
var clean = require('xss-clean/lib/xss').clean
var cleaned = clean('<script></script>');
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
var helmet = require('helmet');
const mongoose = require("mongoose");
//importe routes
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");
mongoose
  .connect("mongodb+srv://seconduser:" + process.env.DB_PASS + "@cluster0.e9cel.mongodb.net/hotsauce?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.use(helmet());
app.use(bodyParser.json());
app.use(limiter);
//routes user
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
module.exports = app;
