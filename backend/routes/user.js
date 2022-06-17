//_____________________________Les routes relatives aux users______________________//

// Importation de "express"
const express = require('express');
// Importation du middleware password
const password = require('../middleware/password');
// Importation du "controller" relatif à user
const userControle = require('../controller/user');
// Importation des routes de "express"
const router = express.Router();


// Envoi des données du formulaire de Signup dans la collection "users" de MongoDB 
router.post('/signup', password, userControle.createUser);
// Envoi des données du formulaire de Login dans la collection "users" de MongoDB 
router.post('/login', userControle.loginUser);

//___________________Exportation des routes_________________//
module.exports = router;