const mpaidPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('trx_id', 'student_id', db.raw('to_char(date_created, \'Mon/dd/yyyy\') as date_created'),
					'status', 'or_num')
				.from('cart').where('status', '=', 'Paid').orderBy('trx_id')
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
	mpaidPopulateTable,
}