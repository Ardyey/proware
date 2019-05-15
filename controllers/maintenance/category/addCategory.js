const dbAddCategory = (req, res, db, logger) => {
	let {
		prodCategory,
		prodCatStatus
	} = req.body;
	if (!prodCategory || !prodCatStatus) {
		res.json({
			haveEmpty: true
		});
		return;
	}

		// util throw a error
  const breakWithMyError = (err) => {
    throw new Error(err);
  }

	db.transaction((trx) => {
			db.select('*').from('product_type').where('type', '=', prodCategory)
				.then(data => {
					if (data[0]) {
						breakWithMyError('EXISTING');
					}
					return db('product_type')
						.returning('*')
						.insert({
							type: prodCategory,
							status: prodCatStatus
						})
				})
				.then(category => {
					return db('activity_logs')
						.returning('*')
						.insert({
							date: new Date(),
							employee_id: req.session.emp_id,
							module: "CATEGORY",
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
					if(err.message == "EXISTING"){
						res.json('Category already Exist!');
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
	dbAddCategory
}