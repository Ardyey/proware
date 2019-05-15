const dbEditTertiary = (req, res, db, logger) => {
	let {
		origStudID,
		studentID,
		firstName,
		middleInitial,
		lastName,
		course
	} = req.body;
	if (!studentID || !firstName || !middleInitial || !lastName || !course) {
		res.json({
			haveEmpty: true
		});
		return;
	}
	db.transaction((trx) => {
			db('student')
				.returning('*')
				.where('student_id', '=', origStudID)
				.update({
					student_id: studentID,
					first_name: firstName,
					middle_initial: middleInitial,
					last_name: lastName,
					course_strand_code: course,
				})
				.then(tertiary => {
					return db('activity_logs')
						.returning('*')
						.insert({
							date: new Date(),
							employee_id: req.session.emp_id,
							module: "TERTIARY STUDENT",
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
	dbEditTertiary
}