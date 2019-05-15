const eSuccessPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('trx_id', 'item_code', 'quantity', 'exchange_price', 'status', 'exch_or_num')
				.from('exchange_items').where('status', '=', 'Success').orderBy('trx_id')
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
					logger.error(0,err);
					trx.rollback;
				});
		})
		.catch(err => logger.error(0, err));
}

module.exports = {
	eSuccessPopulateTable,
}