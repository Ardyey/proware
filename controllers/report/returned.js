//NOT BEING USED
const rreturnedPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*')
				.from('returned_order')
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

const rreturnedItemPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*')
				.from('returned_item')
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
	rreturnedPopulateTable,
	rreturnedItemPopulateTable
}