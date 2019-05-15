const viewTrxItems = (req, res, db, logger) => {
	let {
		transaction
	} = req.query;
	db.transaction((trx) => {
			db.select('trx_id', 'item_code', 'item_description', 'quantity', 'sub_total', 'status')
				.from('cart_item').where({
					trx_id: transaction
				}).orderBy('trx_id')
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
					console.log(err);
					logger.error(err);
					trx.rollback;
				});
		})
		.catch(err => logger.error(err));
}

module.exports = {
	viewTrxItems
}