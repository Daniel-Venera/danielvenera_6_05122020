const fs = require('fs');
const Sauce = require("../models/Sauce");
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  if (sauceObject.name.length > 50) {
    return res.status(400).json({error: 'le nom de la sauce doit contenir 50 caractères maximum'})
  } else if (sauceObject.manufacturer.length > 50) {
    return res.status(400).json({error: 'le nom du cuisinier doit contenir 50 caractères maximum'})     
  } else if (sauceObject.description.length > 150) {
    return res.status(400).json({error: 'la description doit contenir 150 caractères maximum'})     
  } else if (sauceObject.mainPepper.length > 50) {
    return res.status(400).json({error: 'le nom de du piment doit contenir 50 caractères maximum'})     
  } else if ( typeof sauceObject.heat !== 'number' || sauceObject.heat < 0 || sauceObject.heat > 10  ) {
    return res.status(400).json({error: 'la puissance du piment doit être un chiffre contenu entre 0 et 10'})     
  } else {
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
    });
    sauce
      .save()
      .then(() => {
        res.status(201).json({
          message: "Sauce enregistrée!"
        });
      })
      .catch(error => {
        res.status(400).json({
          error: error
        });
      });
  }
};
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  })
    .then(sauce => {
      res.status(200).json(sauce);
    })
    .catch(error => {
      res.status(404).json({
        error: error
      });
    });
};
exports.updateOneSauce = (req, res, next) => {
  console.log(req.params.id)
  console.log(req.file);
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      }
    : { ...req.body };
    if (req.file) {
      Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, function (err) {
          if (err) throw err;
        });
        })
        .catch(error => res.status(500).json({ error }));
    } 
    if (sauceObject.name.length > 50) {
      return res.status(400).json({error: 'le nom de la sauce doit contenir 50 caractères maximum'})
    } else if (sauceObject.manufacturer.length > 50) {
      return res.status(400).json({error: 'le nom du cuisinier doit contenir 50 caractères maximum'})     
    } else if (sauceObject.description.length > 150) {
      return res.status(400).json({error: 'la description doit contenir 150 caractères maximum'})     
    } else if (sauceObject.mainPepper.length > 50) {
      return res.status(400).json({error: 'le nom de du piment doit contenir 50 caractères maximum'})     
    } else if ( typeof sauceObject.heat !== 'number' || sauceObject.heat < 0 || sauceObject.heat > 10  ) {
      return res.status(400).json({error: 'la puissance du piment doit être un chiffre contenu entre 0 et 10'})     
    } else {
      Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Objet modifié !" }))
        .catch(error => res.status(400).json(error));
    }
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
exports.deleteOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
exports.createLikeOneSauce = (req, res, next) => {
  switch (req.body.like) {
    case 1:
      Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId }, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Like ajouté !" }))
        .catch(error => res.status(400).json(error));
      break;
    case 0:
      Sauce.findOne({
        _id: req.params.id
      })
        .then(sauce => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }, _id: req.params.id })
              .then(() => res.status(200).json({ message: "Like supprimé !" }))
              .catch(error => res.status(400).json(error));
          }
          if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId }, _id: req.params.id })
              .then(() => res.status(200).json({ message: "Dislike supprimé !" }))
              .catch(error => res.status(400).json(error));
          }
        })
        .catch(error => res.status(400).json(error));
      break;
    case -1:
      Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId }, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
        .catch(error => res.status(400).json(error));
      break;
  }
};
