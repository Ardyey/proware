const logMonitoringPopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('employee_id', db.raw('to_char(date, \'Mon/dd/yyyy\') as date'), 'module', 'trx_id', 'activity')
				.from('activity_order_logs')
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
		.catch(err => logger.error(err))
}

module.exports = {
	logMonitoringPopulateTable,
}