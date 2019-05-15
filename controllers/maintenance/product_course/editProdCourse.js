const dbEditProdCourse = (req, res, db, logger) => {
	let {
		origCourse,
		prodCourse
	} = req.body;
	if (!prodCourse) {
		res.json({
			haveEmpty: true
		});
		return;
	}
	db.transaction((trx) => {
			db.select('*').from('product_course').where('course', '=', prodCourse)
				.then(data => {
					if (data[0]) {
						res.json('Product Course already Exist!');
						return;
					}
					return db('product_course')
						.returning('*')
						.where('course', '=', origCourse)
						.update({
							course: prodCourse
						})
				})
				.then(course => {
					return db('activity_logs')
						.returning('*')
						.insert({
							date: new Date(),
							employee_id: req.session.emp_id,
							module: "PRODUCT COURSE",
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
	dbEditProdCourse
}