const tertiaryPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('student').where('student_category', '=', 'TERTIARY').orderBy('student_id')
				.then(data => {
					if (data[0]) {
						res.json(data);
						return;
					} else {
						res.json('');
						return;
					}
				})
				.then(trx.commit)
				.catch(err => {
					logger.error(err);
					trx.rollback;
				});
		})
		.catch(err => logger.error(err));
}

const getCourse = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('code').from('course_strand').where('type', '=', 'Tertiary').orderBy('code')
				.then(data => {
					if (data[0]) {
						res.json(data);
						return;
					} else {
						res.json('Error getting course');
						return;
					}
				})
				.then(trx.commit)
				.catch(err => {
					logger.error(err);
					trx.rollback;
				});
		})
		.catch(err => logger.error(err));
}

module.exports = {
	tertiaryPopulateTable,
	getCourse
}