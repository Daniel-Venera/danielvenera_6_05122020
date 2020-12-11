const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//importe routes
const userRoutes = require("./routes/user");
//importe models
const Sauce = require("./models/Sauce");
const User = require("./models/User");
mongoose
  .connect("mongodb+srv://danielvenera:dDla0D7p9jwBayZl@cluster0.e9cel.mongodb.net/<dbname>?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});
app.use(bodyParser.json());
//routes user
app.use("/api/auth", userRoutes);
module.exports = app;
