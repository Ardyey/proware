const populateTable = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('trx_id', 'student_id', db.raw('to_char(date_purchased, \'Mon/dd/yyyy\') as date_purchased'),
					 'or_num')
				.from('sales_transaction').orderBy('trx_id')
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

const retPopulateTable = (req, res, db, logger) => {
	let {
		trx_id
	} = req.query;
	db.transaction((trx) => {
			db.select('trx_id', 'student_id', db.raw('to_char(date_purchased, \'Mon/dd/yyyy\') as date_purchased'),
					'item_code', 'item_description', 'quantity', 'sub_total', 'or_num')
				.from('sales_item').where({
					trx_id: trx_id
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

const returnItem = (req, res, db, logger) => {
	let {
		trx_id,
		itemCode,
		status,
		returnReason,
		orNumber
	} = req.body;
	console.log(trx_id,
		itemCode,
		status,
		returnReason,
		orNumber)
	db.transaction((trx) => {
			db('cart_item')
				.returning('*')
				.where({
					trx_id: trx_id,
					item_code: itemCode
				})
				.update({
					status: status,
					return_reason: returnReason
				})
				.then(item => {
					if(item[0]){
						db('activity_order_logs')
							.returning('*')
							.insert({
								date: new Date(),
								employee_id: req.session.emp_id,
								module: "RETURN ITEM",
								trx_id: trx_id,
								activity: status,
								or_num: orNumber
							})
							.then(activity => {
								if (activity[0]) {
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
								res.render('pages/error-500');
							});
					}
					else{
						res.render('pages/error-500');
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
	populateTable,
	retPopulateTable,
	returnItem
}