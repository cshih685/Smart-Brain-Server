const handleProfile = (req, res, db) => {
	const{id} = req.params;
	db.select('*').from('users').where({id: id})
	.then(user => {
		console.log(user); //it returns array even if it's empty
		if(user.length){
			res.json(user[0]);
		}else{
			res.status(400).json('error getting user');
		}
	})


	/*//without databse
	let found = false;
	database.users.forEach(user =>{
		if(user.id === id){
			found = true;
			return res.json(user);
		}
	})
	if(!found){
		res.status(400).json('not found');
	}*/
}

module.exports ={
	handleProfile : handleProfile
}