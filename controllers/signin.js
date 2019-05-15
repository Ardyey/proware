const handleSignin = (req, res, db, logger, bcrypt) => {
	let {
		username,
		password
	} = req.body;
	db.transaction((trx) => {
			db.select('*').from('login_view').where('username', '=', username)
				.then(data => {
					if (data[0].status == 'Inactive') {
						res.json({
							inactive: true
						});
						return;
					}
					const isValid = bcrypt.compareSync(password, data[0].hash);
					if (isValid) {
						req.session.user = username;
						req.session.emp_id = data[0].employee_id;
						req.session.position = data[0].description;
						res.json({
							isValid: true
						});
						return;
					} else {
						res.json({
							isValid: false
						});
						return;
					}
				})
				.then(trx.commit)
				.catch(err => {
					logger.error(err);
					trx.rollback;
					res.json({
						isValid: false
					});
					return;
				});
		})
		.catch(err => logger.error(err));
}

module.exports = {
	handleSignin
}