const dbAddTertiary = (req, res, db, logger) => {
	let {
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

			//util throw error
	const breakWithError = (err) => {
		throw new Error(err);
	}

	db.transaction((trx) => {
			db.select('*').from('student').where('student_id', '=', studentID)
				.then(data => {
					if (data[0]) {
						breakWithError('EXISITING');
					}
					return db('student')
						.returning('*')
						.insert({
							student_id: studentID,
							first_name: firstName,
							middle_initial: middleInitial,
							last_name: lastName,
							course_strand_code: course,
							student_category: "TERTIARY"
						})
				})
				.then(tertiary => {
					return db('activity_logs')
						.returning('*')
						.insert({
							date: new Date(),
							employee_id: req.session.emp_id,
							module: "TERTIARY STUDENT",
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
					if(err.message == 'EXISITING'){
						res.json('Tertiary Student already Exist!');
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
	dbAddTertiary
}