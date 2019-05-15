const dbDeleteProdCourse = (req, res, db, logger) => {
	let {
		origCourse
	} = req.body;
	db.transaction((trx) => {
			db('product_course')
				.returning('*')
				.where('course', '=', origCourse)
				.del()
				.then(cat => {
					db('activity_logs')
						.returning('*')
						.insert({
							date: new Date(),
							employee_id: req.session.emp_id,
							module: "PRODUCT COURSE",
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
	dbDeleteProdCourse
}