const dbEditUser = (req, res, db, logger) => {
	let {
		employeeID,
		username,
		firstName,
		lastName,
		status,
		position,
		origUser
	} = req.body;
	if (!employeeID || !username || !firstName || !lastName || !status || !position) {
		res.json({
			haveEmpty: true
		});
		return;
	}
	let pos_id = '';
	db.transaction((trx) => {
			db.select('id').from('position').where('description', '=', position)
				.then(data => {
					if (data[0]) {
						pos_id = data[0].id;
						db('user')
							.returning('*')
							.where('username', '=', origUser)
							.update({
								employee_id: employeeID,
								username: username,
								first_name: firstName,
								last_name: lastName,
								status: status,
								position_id: pos_id
							})
							.then(user => {
								if (user[0]) {
									db('login')
										.returning('*')
										.where('username', '=', origUser)
										.update({
											employee_id: employeeID,
											username: username
										})
										.then(login => {
											db('activity_logs')
												.returning('*')
												.insert({
													date: new Date(),
													employee_id: req.session.emp_id,
													module: "USER",
													activity: "EDIT"
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
													logger.error(err);
													trx.rollback;
													res.render('pages/error-500');
												});
										})
								}
							})
							.then(trx.commit)
							.catch(err => {
								logger.error(err);
								trx.rollback;
								res.render('pages/error-500');
							});
					}
				})
				.then(trx.commit)
				.catch(err => {
					logger.error(err);
					trx.rollback;
					res.render('pages/error-500');
				});
		})
		.catch(err => logger.error(err));
}

module.exports = {
	dbEditUser
}