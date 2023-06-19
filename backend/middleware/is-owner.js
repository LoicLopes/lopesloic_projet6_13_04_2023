const Sauce = require('../models/sauce');

module.exports = (req, res, next)=>{
    Sauce.findOne({_id: req.paramas.id})
    .then ((sauce)=>{
        if(sauce.userId=req.auth.userId){
            next();
        }else{
            res.status(401).json({ message : "Non autorisé"});
        }
    })
    .catch((error)=>{
        res.status(401).json({ error });
    })
}