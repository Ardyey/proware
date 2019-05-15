const dbDeleteUser = (req, res, db, logger) => {
	let {
		username
	} = req.body;
	db.transaction((trx) => {
			db('login')
				.returning('*')
				.where('username', '=', username)
				.del()
				.then(user1 => {
					if (user1[0]) {
						db('user')
							.returning('*')
							.where('username', '=', username)
							.del()
							.then(user2 => {
								db('activity_logs')
									.returning('*')
									.insert({
										date: new Date(),
										employee_id: req.session.emp_id,
										module: "USER",
										activity: "DELETE"
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
							.then(trx.commit)
							.catch(err => {
								logger.error(err);
								trx.rollback;
								res.render('pages/error-500');
							});
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
		.catch(err => logger.error(err));
}

module.exports = {
	dbDeleteUser
}