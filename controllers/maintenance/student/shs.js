const shsPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('student').where('student_category', '=', 'SHS').orderBy('student_id')
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

const getStrand = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('code').from('course_strand').where('type', '=', 'SHS').orderBy('code')
				.then(data => {
					if (data[0]) {
						res.json(data);
						return;
					} else {
						res.json('Error getting strand');
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
	shsPopulateTable,
	getStrand
}