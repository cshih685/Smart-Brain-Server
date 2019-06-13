const handleSignin = (db, bcrypt) => (req, res) => { //we firstly handle signin with db&bcrypt, then send req&res
	//destructor email and password from request
	const { email, password } = req.body;
	if(!email || !password){
		return res.status(400).json('incorrect form submission!');
	}


	//select email and hash from login to check the email and hash(compare) matched or not
	db.select('email','hash').from('login')
		.where('email', '=', email)
		.then(data =>{
			const isValid = bcrypt.compareSync(password, data[0].hash); //compare password & hash
			console.log(isValid);
			if(isValid){
				return db.select('*').from('users')
				.where('email', '=', email)
				.then(user => {
					res.json(user[0]);
				})
				.catch(err => res.status(400).json('unable to get user'));
			}else{
				res.status(400).json(`Can't get from users -> wrong credentials`);
			}
		})
		.catch(err => res.status(400).json(`Can't get from login -> wrong credentials`));


	/*//without database
	if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
		res.json(database.users[0]);
	}else{
		res.status(400).json('error logging in');
	}*/
}

module.exports ={
	handleSignin: handleSignin
}

/*//bcrypt practice
bcrypt.compare('anna123', '$2a$10$iMLUi0J6QMQ/XZIizHpBIO173zBD4I7ePT5YFbty4zQe4kHogGwVi', function(err, res) {
    	console.log('first guess: ', res);
	});
	bcrypt.compare('anna', '$2a$10$iMLUi0J6QMQ/XZIizHpBIO173zBD4I7ePT5YFbty4zQe4kHogGwVi', function(err, res) {
    	console.log('first guess: ', res);
	});*/