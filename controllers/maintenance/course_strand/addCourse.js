const dbAddCourse = (req, res, db, logger) => {
let {
	code, description, type
} = req.body;
if (!code || !description || !type) {
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
		db.select('*').from('course_strand').where('code', '=', code)
			.then(data => {
				if (data[0]) {
					breakWithError('EXISTING');
				}
				return db('course_strand')
					.returning('*')
					.insert({ code, description, type })
			})
			.then(category => {
				return db('activity_logs')
					.returning('*')
					.insert({
						date: new Date(),
						employee_id: req.session.emp_id,
						module: "COURSE / STRAND",
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
				if(err.message == 'EXISTING'){
					res.json({
						isSuccess: false
					});
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
	dbAddCourse
}