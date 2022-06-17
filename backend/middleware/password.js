// Importation de password-validator
const passwordValidator = require("password-validator");
// création du schéma
passwordSchema = new passwordValidator()

// le schéma que doit respecter l'utilisateur
passwordSchema
    .is().min(6) // Minimum length 8
    .is().max(100) // Maximum length 100
    .has().uppercase(1) // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits(2) // Must have at least 2 digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res
            .status(400)
            .json({ message: `Pour créer un compte, le mot de passe doit contenir : 
      - 2 majuscules ;
      - 2 chiffres ;
      - 6 caracatères minimum ;
      - 100 caracatères maximum ;
      - pas d'espace ; 
     ` })
            //Il manque à votre mot de passe : ${passwordSchema.validate('req.body.password',{ list: true })}
    }
}