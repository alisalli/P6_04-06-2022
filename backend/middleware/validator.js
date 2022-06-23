// Importation de password-validator
const passwordValidator = require("password-validator");
// création du schéma
passwordSchema = new passwordValidator();

// le schéma que doit respecter l'utilisateur
passwordSchema
.is().min(8)                                    // Longueur minimun : 8
.has().uppercase()                              // Doit avoir au moins une majuscule
.has().lowercase()                              // Doit avoir au moins une minuscule
.has().digits()                                 // Doit avoir au moins un chiffre
.has().not().spaces()                           // Ne doit pas avoir d'espaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist de valeurs à proscrire

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(400).json({
            message: `Pour créer un compte, le mot de passe doit contenir : 
      - 2 majuscules ;
      - 2 chiffres ;
      - 6 caracatères minimum ;
      - 100 caracatères maximum ;
      - pas d'espace ; 
     `,
        });
        //Il manque à votre mot de passe : ${passwordSchema.validate('req.body.password',{ list: true })}
    }
};