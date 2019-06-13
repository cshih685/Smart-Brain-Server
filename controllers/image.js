//must add your own API key here from Clarifai
const Clarifai = require('clarifai');
const app = new Clarifai.App({
 apiKey: '715143c80efb47db8d8da45818a1948b'
});
const handleApiCall = (req, res) =>{
	app.models
	.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
	.then(data => {
		res.json(data); //send repsonse back to front-end
	})
	.catch(err => res.status(400).json('unable to connect to Clarifai API'));
}




const handleImage = (req, res, db) => {
	const{ id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries') //return an array important!!
	.then(entries =>{
		// console.log(entries);
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entires'))


	/*//without database
	let found = false;
	database.users.forEach(user =>{
		if(user.id === id){
			found = true;
			user.entries++
			return res.json(user.entries); //increase entries every time user click search
		}
	})
	if(!found){
		res.status(400).json('not found');
	}*/
}

module.exports = {
	handleImage,
	handleApiCall
}