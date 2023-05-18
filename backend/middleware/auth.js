const jsontoken = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    try{
        console.log('authentification 1');
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jsontoken.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        console.log('authentification 2');
        req.auth = {
            userId: userId
        };
    }catch(error){
        console.log('authentification du token erreur');
        res.status(401).json({ error });
    }
};