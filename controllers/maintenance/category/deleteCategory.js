const dbDeleteCategory = (req, res, db, logger) => {
	let {
		catID
	} = req.body;
	db.transaction((trx) => {
			db('product_type')
				.returning('*')
				.where('id', '=', catID)
				.del()
				.then(cat => {
					return db('activity_logs')
						.returning('*')
						.insert({
							date: new Date(),
							employee_id: req.session.emp_id,
							module: "CATEGORY",
							activity: "DELETE"
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
					logger.error(err);
					trx.rollback;
					res.render('pages/error-500');
				});
		})
		.catch(err => logger.error(err));
}

module.exports = {
	dbDeleteCategory
}