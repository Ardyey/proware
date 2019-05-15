const populateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('trx_id', 'student_id', db.raw('to_char(date_created, \'Mon/dd/yyyy\') as date_created'),
					'status', 'or_num').from('cart')
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
	populateTable
}