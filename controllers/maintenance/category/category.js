const catPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('product_type').orderBy('id')
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
					res.render('pages/error-500');
				});
		})
		.catch(err => logger.error(err));
}

module.exports = {
	catPopulateTable,
}