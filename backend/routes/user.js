//_____________________________Les routes relatives aux users______________________//

// Importation de "express"
const express = require('express');
// Importation du middleware password
const validator = require('../middleware/validator');
// Importation du "controller" relatif à user
const userControle = require('../controller/user');
// Importation des routes de "express"
const router = express.Router();


// Envoi des données du formulaire de Signup dans la collection "users" de MongoDB 
router.post('/signup', validator, userControle.signup);
// Envoi des données du formulaire de Login dans la collection "users" de MongoDB 
router.post('/login', validator, userControle.login);

//___________________Exportation des routes_________________//
module.exports = router;