const handleRegister = (req, res, db, bcrypt) => {
	const{name, email, password} = req.body; //decontructor

	//if we don't get any of these inputs, return error. Need to check front-end too
	if(!name || !email || !password) {
		return res.status(400).json('incorrect form submission!');
	} 
	// hash password 
	const hash = bcrypt.hashSync(password);
	// console.log(hash);
	//store into login first (which we don't want to be returned) -> using transaction
	db.transaction(trx => {  //trx means db
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login') // insert 'hash' and 'email' into login
		.returning('email')  //return what we need to use later
		//then we get the email from table login again and reuse it to store into table users
		.then(loginEmail =>{
			//now here is what we want to return to front end
			//instead of using db, now db is replaced by trx
			return trx('users')
			.returning('*') //select all -> it's a promise we can return later
			.insert({
				email: loginEmail[0], //because it will return an array, so get the index 0
				name: name,
				joined: new Date()
			})
			//after insert, then send response to front end
			.then(user =>{
				console.log(user[0]);
				res.json(user[0]); //from returning
			})
		})
		//after completing moving, we need to commit so that trx can be excuted
		.then(trx.commit)
		.catch(trx.rollback)  //catch if there's error
	})
	// db('users')
	// .returning('*') //select all -> it's a promise we can return later
	// .insert({
	// 	email: email,
	// 	name: name,
	// 	joined: new Date()
	// })
	// .then(user => {   // 
	// 	res.json(user[0]);  //from returning
	// })
	.catch(err => res.status(400).json('unable to register!'))
	

/*//test without database
	database.users.push({
		id: '135',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date()
	})
	//if you don't have res --> server will stuck there
	// res.json(database.users[database.users.length-1]);
	*/
	
	// here we use knex to manipulate with real database
	
}

module.exports = {
	handleRegister: handleRegister
};