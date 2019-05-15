const updateOrder = (req, res, db, logger) => {
	let {
		status,
		trx_id,
		orNumber,
		item_code
	} = req.body;
	console.log(status,
		trx_id,
		orNumber,
		item_code)
	db.transaction((trx) => {
			db('exchange_items')
				.returning('*')
				.where({
					trx_id: trx_id,
					item_code: item_code
				})
				.update({
					status: status,
					exch_or_num: orNumber,
					exchange_date: new Date()
				})
				.then(order => {
					if (status === 'Success') {
						let newQuantity = '';
						db.select('*').from('product').where('item_code', '=', item_code)
							.then(product => {
								if (product[0]) {
									newQuantity = parseInt(product[0].stock) - parseInt(order[0].quantity)
									return db('product')
										.returning('*')
										.where('item_code', '=', item_code)
										.update({
											stock: newQuantity
										})
								}
							})
							.then(stock => {
								if (stock[0]) {
									return db('activity_order_logs')
										.returning('*')
										.insert({
											date: new Date(),
											employee_id: req.session.emp_id,
											module: "EXCHANGE MONITORING",
											trx_id: trx_id,
											activity: status,
											or_num: orNumber
										})
								}
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
								logger.error(0, err);
								trx.rollback;
								res.render('pages/error-500');
							});
					} else if (status === 'Returned') {
						if (order[0]) {
							db('activity_order_logs')
								.returning('*')
								.insert({
									date: new Date(),
									employee_id: req.session.emp_id,
									module: "EXCHANGE MONITORING",
									trx_id: trx_id,
									activity: status,
									or_num: orNumber,
									return_reason: returnReason
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
									logger.error(0, err);
									trx.rollback;
									res.render('pages/error-500');
								});
						}
					} else {
						if (order[0]) {
							db('activity_order_logs')
								.returning('*')
								.insert({
									date: new Date(),
									employee_id: req.session.emp_id,
									module: "EXCHANGE MONITORING",
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
									logger.error(0, err);
									trx.rollback;
									res.render('pages/error-500');
								});
						}
					}
				})
				.then(trx.commit)
				.catch(err => {
					logger.error(0, err);
					trx.rollback;
					res.render('pages/error-500');
				});
		})
		.catch(err => logger.error(err));
}

module.exports = {
	updateOrder
}