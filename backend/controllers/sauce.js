const Sauce = require ('../models/sauce');
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId; 
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: "Sauce créée !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    } : { ...req.body };
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (req.file) {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {});
        }
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) 
            .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
            .catch((error) => res.status(401).json({ error }));
        
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  };
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            Sauce.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
              .catch((error) => res.status(400).json({ error }));
          }); 
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  };
  
exports.likeSauce = (req, res, next) => {
    const like = req.body.like;
    switch (like) {
        case 1:
            Sauce.findOne ({ _id: req.params.id }) 
                .then ((sauce)=>{
                    if(sauce.usersLiked.includes(req.body.userId)){
                    res.status(401).json({ message : "Déja liké"});
                    }else{
                    Sauce.updateOne(
                    { _id: req.params.id },
                    { $push: { usersLiked: req.body.userId }, $inc: { likes: 1 } }
                    )
                    .then(() => res.status(200).json({ message: "Sauce likée" }))
                    .catch((error) => res.status(400).json({ error }));
                }
            })
        .catch((error) => res.status(400).json({ error }));

    break;
        case -1: 
        Sauce.findOne ({ _id: req.params.id }) 
            .then ((sauce)=>{
                    if(sauce.usersDisliked.includes(req.body.userId)){
                    res.status(402).json({ message : "Déja disliké"});
                    }else{
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $push: { usersDisliked: req.body.userId },
                                $inc: { dislikes: 1 },
                            }
                        )
                            .then(() => res.status(200).json({ message: "Sauce dislikée" }))
                            .catch((error) => res.status(400).json({ error }));
                    }
                })
            .catch((error) => res.status(406).json({ error }));
            break;
        case 0: 
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $pull: { usersLiked: req.body.userId },
                                $inc: { likes: -1 },
                            }
                        )
                            .then(() => res.status(200).json({ message: "Like supprimé" }))
                            .catch((error) => res.status(403).json({ error }));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $pull: { usersDisliked: req.body.userId },
                                $inc: { dislikes: -1 },
                            }
                        )
                            .then(() => res.status(200).json({ message: "Dislike supprimé" }))
                            .catch((error) => res.status(400).json({ error }));
                    }
                })
                .catch((error) => {
                    res.status(400).json({ error });
                });
            break;
        default:
            res.status(400).json({ error });
    }
};
