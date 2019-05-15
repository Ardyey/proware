const movingPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*')
				.from('inventory_view')
				.where('movement_status', '=', 'MOVING')
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

const nmovingPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*')
				.from('inventory_view')
				.where('movement_status', '=', 'NON-MOVING')
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

module.exports = {
	movingPopulateTable,
	nmovingPopulateTable,
}