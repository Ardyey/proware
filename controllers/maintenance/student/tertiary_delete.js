const dbDeleteTertiary = (req, res, db, logger) => {
	let {
		origStudID
	} = req.body;
	db.transaction((trx) => {
			db('student')
				.returning('*')
				.where('student_id', '=', origStudID)
				.del()
				.then(tertiary => {
					db('activity_logs')
						.returning('*')
						.insert({
							date: new Date(),
							employee_id: req.session.emp_id,
							module: "TERTIARY STUDENT",
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
		})
		.catch(err => logger.error(err));
}

module.exports = {
	dbDeleteTertiary
}