const bcrypt = require ('bcrypt');
const jsonwebtoken = require ('jsonwebtoken');
const User = require ('../models/user');

exports.signup = (req, res, next)=>{
    bcrypt.hash(req.body.password, 10)
        .then(hash =>{
            const user = new User({
                email : req.body.email,
                password : hash
            });
        user.save()
            .then(()=> res.status(201).json({ message:'Utilisateur créé !'}))
            .catch((error) => {
                console.log('signup : catch 1 ',error);
                res.status(400).json( 'Une erreur s\'est produite' );
            }
                );
        })
        .catch((error) => {
            console.log('signup : catch 2 ',error);
            res.status(400).json( 'Une erreur s\'est produite' );
        }
            );
};

exports.login = (req, res, next)=> {
    
    User.findOne({email: req.body.email})
    .then((user) => {       
        if (user === null){
            res.status(401).json({message : 'Paire identifiant/mot de passe incorrecte'})
        }
        else{
            bcrypt.compare(req.body.password , user.password)
            .then(valid=>{
                if(!valid){
                    res.status(401).json({message : 'Paire identifiant / mot de passe incorrecte '})
                }
                else{
                    res.status(200).json({
                        userId: user.id,
                        token: jsonwebtoken.sign(
                            {userId: user._id},
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h'}
                            )
                    });

                }

            })
            .catch((error) => {
                console.log('login : catch 1 ',error);
                res.status(500).json( 'Une erreur s\'est produite' );
            }
                );
        }
    })
    .catch((error) => {
        console.log('login : catch 2 ',error);
        res.status(500).json( 'Une erreur s\'est produite' );
    }
        );
};
