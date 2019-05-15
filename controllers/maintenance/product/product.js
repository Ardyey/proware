const prodPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('product_view')
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

const updateStatus = (req, res, db, logger) => {
	let { prodCode, status } = req.body;
	db.transaction((trx) => {
			db('product')
				.returning('*')
				.where('item_code', '=', prodCode)
				.update({ status: status })
				.then(data => {
					if (data[0]) {
						res.json({
							isSuccess: true
						});
						return;
					} else {
						res.json({
							isSuccess: false
						});
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

const getCategory = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('product_type').orderBy('id')
				.then(data => {
					if (data[0]) {
						res.json(data);
						return;
					} else {
						res.json('Error getting category');
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
	prodPopulateTable,
	getCategory,
	updateStatus
}