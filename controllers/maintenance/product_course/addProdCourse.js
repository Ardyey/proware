const dbAddProdCourse = (req, res, db, logger) => {
let {
	prodCourse
} = req.body;
if (!prodCourse) {
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
		db.select('*').from('product_course').where('course', '=', prodCourse)
			.then(data => {
				if (data[0]) {
					breakWithError('EXISTING');
				}
				return db('product_course')
					.returning('*')
					.insert({
						course: prodCourse
					})
			})
			.then(category => {
				return db('activity_logs')
					.returning('*')
					.insert({
						date: new Date(),
						employee_id: req.session.emp_id,
						module: "PRODUCT COURSE",
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
					res.json('Product Course already Exist!');
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
	dbAddProdCourse
}