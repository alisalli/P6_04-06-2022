//_________________________________Modèle pour l'user______________________//
//Importation de mongoose
const mongoose = require('mongoose');
//Importation de l'outil "unique-validator"
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

//permet de ne pas avoir deux adresses email similaires dans la collection User de Mongoose
userSchema.plugin(uniqueValidator);
// Exportation du modèle 'User'
module.exports = mongoose.model('User', userSchema);