const populateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('user_view').orderBy('employee_id')
				.then(data => {
					if (data[0]) {
						res.json(data);
						return;
					} else {
						res.render('pages/error-500');
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
		.catch(err => logger.error(err));
}

const resetPassword = (req, res, db, logger, bcrypt) => {
	let {
		employeeID,
		password
	} = req.body;
	const hash = bcrypt.hashSync(password);
	if (!password) {
		res.json({
			haveEmpty: true
		});
		return;
	}
	db.transaction((trx) => {
			db('login')
				.returning('*')
				.where('employee_id', '=', employeeID)
				.update({
					hash
				})
				.then(data => {
					if (data[0].employee_id) {
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
				})
		})
		.catch(err => logger.error(err));
}


module.exports = {
	populateTable,
	resetPassword
}