const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
var passwordValidator = require('password-validator');
var schema = new passwordValidator();
schema
.is().min(8)                                    
.is().max(100)                                  
.has().uppercase()                              
.has().lowercase()                              
.has().digits(2)                                
.has().not().spaces()                           
exports.signup = (req, res, next) => {
  var mailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
  if (!schema.validate(req.body.password)) {
    return res.status(400).json({error : 'Mot de passe non conforme : Votre mot doit contenir au moins 8 caractères avec une majuscule, une minuscule, 2 chiffres et aucun espace'});
  } else if (schema.validate(req.body.password)) {
    console.log(mailRegex.test(req.body.email))
    if (mailRegex.test(req.body.email)) {
      bcrypt
      .hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => {
        res.status(500).json({ error });
      });
    } else {
      return res.status(400).json({error: 'Email non conforme'})
    }
  } 
};
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" })
          }); 
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};
