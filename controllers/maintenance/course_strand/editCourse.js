const dbEditCourse = (req, res, db, logger) => {
	let {
		origCourse, code, description, type
	} = req.body;
	if (!code || !description || !type) {
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
				db('course_strand')
					.returning('*')
					.where('code', '=', origCourse)
					.update({ code, description, type })
				.then(course => {
					return db('activity_logs')
						.returning('*')
						.insert({
							date: new Date(),
							employee_id: req.session.emp_id,
							module: "COURSE / STRAND",
							activity: "EDIT"
						})
				})
				.then(activity => {
					console.log('hi')
					if (activity[0]) {
						return res.json({
							isSuccess: true
						});
					} else {
						return res.json({
							isSuccess: false
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
	dbEditCourse
}