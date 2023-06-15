const { body , validationResult } = require ('express-validator');
const validator = require ('email-validator');
const passwordValidator = require ('password-validator');


async function validateUser (req, res, next){
     Promise.all([
        body('email').isEmail(),
        body('password').isLength({min:6}).run(req),
    ]);
    const email = req.body.email
    if(!validator.validate(email)){
        return res.status(400).json({message : 'Email invalide'})
    }
    
    const password = req.body.password;
    const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(6)                    // Le mot de passe doit comporter au moins 8 caractères
    .is().max(100)                  // Le mot de passe ne peut pas dépasser 100 caractères
    .has().not().spaces();          // Le mot de passe ne doit pas contenir d'espaces
    //.has().uppercase()            // Le mot de passe doit contenir au moins une lettre majuscule
    //.has().lowercase()            // Le mot de passe doit contenir au moins une lettre minuscule
    //.has().digits()               // Le mot de passe doit contenir au moins un chiffre
  

  if (!passwordSchema.validate(password)) {
    return res.status(400).json({ errors: [{ msg: 'Mot de passe invalide' }] });
  }
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors });
    }
    next();
}

module.exports = validateUser;