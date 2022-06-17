//_____________________________Les routes relatives aux sauces______________________//

//_______________Utils pour l'importation_________________//
// Importation de "express"
const express = require('express');
// Importation des routes de "express"
const router = express.Router();
// Importation du "middleware" relatif à l'authentification
const authentification = require('../middleware/auth');
// Importation du "middleware" relatif à "multer" pour la gestion des fichiers images
const multer = require('../middleware/multer-config');
// Importation du "controller" relatif au sauce
const sauceControle = require('../controller/sauce');

//_______________Gestion des routes_________________//
// permet à l'usager de trouver toutes les sauces
router.get('/', authentification, sauceControle.findAllSauces);
// permet à l'usager de trouver une sauce
router.get('/:id', authentification, sauceControle.findOneSauce);
// Envoi des données du formulaire de sauce dans la collection MongoDB
router.post('/', authentification, multer, sauceControle.createSauce);
// permet à l'user de modifier sa sauce, mise à jour des données de la collection MongoDB
router.put('/:id', authentification, multer, sauceControle.modifySauce);
// permet à l'user de supprimer une sauce
router.delete('/:id', authentification, sauceControle.deleteSauce);
// permet d'envoyer son avis sur la recette
router.post('/:id/like', authentification, sauceControle.statusLike);
//___________________Exportation des routes_________________//
module.exports = router;