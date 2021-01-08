const Sauce = require("../models/Sauce");

exports.createSauce = (req, res, next) => {
  console.log("------- DEBUT DE CREATE SAUCE -------");
  // console.log(req.body);
  const sauceObject = JSON.parse(req.body.sauce);
  console.log(sauceObject);
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: []
  });
  console.log(sauce);
  console.log("------- FIN -------");
  sauce
    .save()
    .then(() => {
      console.log("log sauce enregistrée");
      res.status(201).json({
        message: "Sauce enregistrée!"
      });
    })
    .catch(error => {
      console.log("log sauce non enregistrée");
      res.status(400).json({
        error: error
      });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => {
      res.status(200).json(sauces);
    })
    .catch(error => {
      res.status(400).json({
        error: error
      });
    });
};
