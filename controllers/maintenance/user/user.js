const getpopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('user_view').orderBy('employee_id')
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

const getPositions = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('position').orderBy('id')
				.then(data => {
					if (data[0]) {
						res.json(data);
						return;
					} else {
						res.json('Error getting positions');
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
	getpopulateTable,
	getPositions
}