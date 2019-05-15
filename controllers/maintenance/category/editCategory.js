const dbEditCategory = (req, res, db, logger) => {
	let {
		catID,
		prodCategory,
		prodCatStatus
	} = req.body;
	if (!prodCategory || !prodCatStatus) {
		res.json({
			haveEmpty: true
		});
		return;
	}
	db.transaction((trx) => {
			db('product_type')
				.returning('*')
				.where('id', '=', catID)
				.update({
					type: prodCategory,
					status: prodCatStatus,
				})
				.then(category => {
					return db('activity_logs')
						.returning('*')
						.insert({
							date: new Date(),
							employee_id: req.session.emp_id,
							module: "CATEGORY",
							activity: "EDIT"
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
	dbEditCategory
}