const PopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('course_strand')
				.then(data => {
					if (data[0]) {
						return res.json(data);
					} else {
						return res.json('')
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
	PopulateTable,
}