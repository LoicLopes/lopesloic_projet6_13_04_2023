const express =require('express');
const mongoose = require ('mongoose');
const app = express();


const userRoutes =  require ('./routes/user');

let user='lopesloic64';
let password='bayonne';
let cluster='sauce.txezxlg.mongodb.net';
let dbname='thing';
// db = 'mongodb+srv://'lopesloic64':'bayonne'@'sauce.txezxlg.mongodb.net'/'thing'?retryWrites=true&w=majority'
let db= 'mongodb+srv://' + user + ':' + password + '@' + cluster + '/' + dbname + '?retryWrites=true&w=majority';
mongoose.connect(db,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie!'))                                         
  .catch((e) => console.log(e));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(express.json());

app.use('/api/auth', userRoutes);


module.exports = app;
