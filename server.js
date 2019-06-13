const express = require('express');
const bodyparser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
// const saltRounds = 10;
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//getting database
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '0527',
    database : 'smartbrain'
  }
});

// db.select('*').from('users').then(data =>{  //it's a promise
// 	console.log(data);
// });

const app = express();

app.use(bodyparser.json());
app.use(cors());
/*
what we will need in this server
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user 
*/


/*//for testing bcrypt
bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash('3322685', salt, (err, hash) => {
        console.log(hash);
    });
});*/


//for testing without connecting to database
// const database = {
// 	users:[
// 	{
// 		id: '123',
// 		name: 'John',
// 		email: 'john@gmail.com',
// 		password: 'cookies',
// 		entries: 0,
// 		joined: new Date()
// 	},
// 	{
// 		id: '134',
// 		name: 'Sally',
// 		email: 'sally@gmail.com',
// 		password: 'bananas',
// 		entries: 0,
// 		joined: new Date()
// 	}
// 	]
// }

app.listen(3000, ()=>{
	console.log('app is running on port 3000');
})

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', signin.handleSignin(db, bcrypt)) // another way to send parameters

//send everything need to handleRegister
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)} ) 

app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})

app.put('/image', (req, res) => {image.handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)}) //need to add a new post('/imageurl') to get clarifai