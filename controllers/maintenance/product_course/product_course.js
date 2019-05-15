const pcPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('product_course')
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
	pcPopulateTable,
}