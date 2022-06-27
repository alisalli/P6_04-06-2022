//___________________________Création des "controllers" pour les sauces____________________//
// Importation du modèle d'une sauce
const Sauce = require("../models/sauce");
// Importation de l'outil fs (permet de supprimer les fichiers "image" inutils dans le dossier images)
const fs = require("fs");

// controller pour trouver toutes les sauces
exports.findAllSauces = (req, res, next) => {
  // méthode find pour trouver toutes les sauces correspondant au model Sauce
  Sauce.find()
    // puis si "sauces" est trouvé, on valide la requête et on renvoie la réponse au format json
    .then((sauces) => res.status(201).json(sauces))
    .catch((e) =>
      res.status(400).json(e, {
        message: "Aucune sauce n'a été trouvée !",
      })
    );
};

// controller pour trouver une sauce
exports.findOneSauce = (req, res, next) => {
  // méthode findOne pour trouver avec en paramètre l'id de la sauce, une sauce correspondant au model Sauce
  Sauce.findOne(
    {
      _id: req.params.id,
    },
    {
      ...req.body,
    }
  )
    // puis si "oneSauces" est trouvé, on valide la requête et on renvoie la réponse au format json
    .then((oneSauce) => res.status(201).json(oneSauce))
    .catch((e) =>
      res.status(400).json(e, {
        message: "La sauce recherchée n'a pas été trouvée",
      })
    );
};

// controller pour créer une sauce
exports.createSauce = (req, res, next) => {
  // on crée une constante "sauceObject" pour que la requête POST puisse être acceptée
  const sauceObject = JSON.parse(req.body.sauce);
  // on crée et on sauvegarde une sauce dans la collection MongoDB en mettant en place les protocoles de sécurité
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  sauce
    .save()
    .then(() =>
      res.status(201).json({
        message: "La sauce a bien été créée !",
      })
    )
    .catch((e) =>
      res.status(400).json(e, {
        message: "La sauce n'a pas été créée !",
      })
    );
};

// controller pour modifier une sauce
exports.modifySauce = (req, res, next) => {
  if (req.file) {
    Sauce.findOne({
      _id: req.params.id,
    })
      .then((sauce) => {
        // récupération du nom de la photo à supprimer
        const filename = sauce.imageUrl.split("/images/")[1];
        // suppression de l'image lors de la mise à jour de la sauce
        fs.unlink(`images/${filename}`, (error) => {
          if (error) throw error;
        });
      })
      .catch((e) =>
        res.status(400).json(e, {
          message: "La sauce n'a pas été modifiée !",
        })
      );
  } else {
    // throw "erreur lors de la modification de la sauce."
  }
  const sauceObject = req.file
    ? {
        // On récupère les informations existantes depuis la collection MongoDB, puis on met à jour les informations
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        ...req.body,
      };
  Sauce.updateOne(
    {
      _id: req.params.id,
    },
    {
      ...sauceObject,
      _id: req.params.id,
    }
  )
    .then(() =>
      res.status(200).json({
        message: "La sauce a bien été modifiée !",
      })
    )
    .catch((e) =>
      res.status(400).json(e, {
        message: "La sauce n'a pas été modifiée !",
      })
    );
};
// controller pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  // récupérer l'id dans l'url de la requête
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      //On supprime la sauce grâce à son id et on supprime l'image dans le dossier images grâce à la méthode unlink
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne(
          {
            _id: req.params.id,
          },
          {
            ...req.body.imageUrl,
          }
        )
          .then(() =>
            res.status(200).json({
              message: "La sauce a bien été supprimée !",
            })
          )
          .catch(() =>
            res.status(400).json({
              message: "La sauce n'a pas été supprimée !",
            })
          );
      });
    })
    .catch((e) =>
      res.status(500).json(e, {
        message: "Une erreur est survenue.",
      })
    );
};
//___________________________Création des "controllers" pour la gestion des likes____________________//

// controller pour gérer les likes/dislikes
exports.statusLike = (req, res, next) => {
  // récupérer l'id dans l'url de la requête
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauceLikes) => {
      // Si l'userLiked est False et que le like == 1, on incrément dans "likes" la valeur 1 et on push l'id dans l'userLiked
      if (
        !sauceLikes.usersLiked.includes(req.body.userId) &&
        req.body.like === 1
      ) {
        // mise à jour de la collection MongoDB
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            // utilisation de l'opérateur $inc de mongoDB
            $inc: {
              likes: 1,
            },
            // utilisation de l'opérateur push
            $push: {
              usersLiked: req.body.userId,
            },
          }
        )
          .then(() =>
            res.status(200).json({
              message: "J'aime!",
            })
          )
          .catch((e) =>
            res.status(400).json(e, {
              message: "Une erreur est survenue!",
            })
          );
      }
      // Si l'userDisliked est False et que le like == -1, on incrément dans "dislikes" la valeur 1 et on push l'id dans l'userDisliked
      if (
        !sauceLikes.usersDisliked.includes(req.body.userId) &&
        req.body.like === -1
      ) {
        // mise à jour de la collection MongoDB
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            // utilisation de l'opérateur $inc de mongoDB
            $inc: {
              dislikes: 1,
            },
            // utilisation de l'opérateur $push
            $push: {
              usersDisliked: req.body.userId,
            },
          }
        )
          .then(() =>
            res.status(200).json({
              message: "Je n'aime pas !",
            })
          )
          .catch((error) =>
            res.status(400).json(
              {
                error,
              },
              {
                message: "Votre avis n'a pas été mis à jour !",
              }
            )
          );
      }
      // Si l'userLiked est True et que le like == 0, alors on incrémente dans le "likes" la valeur -1 et on supprime l'id de l'userLiked
      if (
        sauceLikes.usersLiked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        // mise à jour de la collection MongoDB
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            // utilisation de l'opérateur $inc de mongoDB
            $inc: {
              likes: -1,
            },
            // utilisation de l'opérateur $pull
            $pull: {
              usersLiked: req.body.userId,
            },
          }
        )
          .then(() =>
            res.status(200).json({
              message: "J'aimais, je n'ai plus d'avis.",
            })
          )
          .catch((error) =>
            res.status(400).json(
              {
                error,
              },
              {
                message: " Votre avis n'a pas été mis à jour !",
              }
            )
          );
      }
      // Si l'userDisliked est True et que le like == 0, alors on incrémente dans le "likes" la valeur -1 et on supprime l'id de l'userDisliked
      if (
        sauceLikes.usersDisliked.includes(req.body.userId) &&
        req.body.like === 0
      ) {
        // mise à jour de la collection MongoDB
        Sauce.updateOne(
          {
            _id: req.params.id,
          },
          {
            // utilisation de l'opérateur $inc de mongoDB
            $inc: {
              dislikes: -1,
            },
            // utilisation de l'opérateur $pull
            $pull: {
              usersDisliked: req.body.userId,
            },
          }
        )
          .then(() =>
            res.status(200).json({
              message: "Je n'aimais pas, je n'ai plus d'avis.",
            })
          )
          .catch((error) =>
            res.status(400).json(
              {
                error,
              },
              {
                message: "Votre avis n'a pas été mis à jour",
              }
            )
          );
      }
    }) // En cas d'erreur, renvoyer un message d'erreur
    .catch(() =>
      res.status(500).json({
        message: "Une erreur est survenue.",
      })
    );
};
