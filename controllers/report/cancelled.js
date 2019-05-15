const rcancelledPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*')
				.from('cancelled_order')
				.then(data => {
					if (data[0]) {
						res.json(data);
					} else {
						res.json('');
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

const rcancelledItemPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*')
				.from('cancelled_item')
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
	rcancelledPopulateTable,
	rcancelledItemPopulateTable
}