const dbAddUser = (req, res, db, logger, bcrypt) => {
	let {
		employeeID,
		username,
		password,
		firstName,
		lastName,
		status,
		position
	} = req.body;
	if (!employeeID || !username || !password || !firstName || !lastName || !status || !position) {
		res.json({
			haveEmpty: true
		});
		return;
	}

	//util throw error
	const breakWithError = (err) => {
		throw new Error(err);
	}

	let hash = bcrypt.hashSync(password);
	let pos_id = '';
	db.transaction((trx) => {
			db.select('id').from('position').where('description', '=', position)
				.then(data => {
					if (data[0]) {
						pos_id = data[0].id;
						return db.select('*').from('user').where('employee_id', '=', employeeID)
					}
				})
				.then(data => {
					if (data[0]) {
						breakWithError('EXISTING');
					}
					return db('user')
						.returning('*')
						.insert({
							employee_id: employeeID,
							username: username,
							first_name: firstName,
							last_name: lastName,
							status: status,
							position_id: pos_id
						})
				})
				.then(user => {
					return db('login')
						.returning('*')
						.insert({
							employee_id: employeeID,
							username: username,
							hash: hash
						})
				})
				.then(login => {
					return db('activity_logs')
						.returning('*')
						.insert({
							date: new Date(),
							employee_id: req.session.emp_id,
							module: "USER",
							activity: "ADD"
						})
				})
				.then(activity => {
					if (activity[0]) {
						res.json({
							isSuccess: true
						});
						return;
					} else {
						res.json({
							isSuccess: false
						});
						return;
					}
				})
				.then(trx.commit)
				.catch(err => {
					if (err.message == 'EXISTING') {
						res.json('User already Exist!');
						return;
					}
					logger.error(err);
					trx.rollback;
					res.render('pages/error-500');
				});
		})
		.catch(err => logger.error(err));

}

module.exports = {
	dbAddUser
}