const logMaintenancePopulateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('employee_id', db.raw('to_char(date, \'Mon/dd/yyyy\') as date'), 'module', 'activity')
				.from('activity_logs')
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
	logMaintenancePopulateTable,
}