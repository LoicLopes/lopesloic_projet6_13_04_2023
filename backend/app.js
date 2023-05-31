require("dotenv").config();
const express =require('express');
const mongoose = require ('mongoose');
const app = express();

const path = require('path');
const userRoutes =  require ('./routes/user');
const sauceRoutes = require ('./routes/sauce');

let user = process.env.DB_USER;
let password = process.env.DB_PASSWORD;
let cluster = process.env.DB_CLUSTER;
let dbname = process.env.DB_NAME;




let db = 'mongodb+srv://'+ user +':'+ password +'@'+ cluster +'/'+ dbname +'?retryWrites=true&w=majority'



mongoose.connect(db,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie!'))                                         
  .catch((e) => console.log(e));


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");

  next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
