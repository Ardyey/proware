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

const exchPopulateTable = (req, res, db, logger) => {
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

const submitItem = (req, res, db, logger) => {
	let {
		trx,
		itemCode,
		itemDesc,
		orNumber,
		quantity,
		subTotal
	} = req.body;
	res.render('pages/back/ret/exchange_item_list',{ 
    id: req.session.user.id,
    position: req.session.position,
    trx: trx,
		itemCode: itemCode,
		itemDesc: itemDesc,
		quantity: quantity,
		subTotal: subTotal
    });
}

const submitValue = (req, res, db, logger) => {
	let {
		trx_id,
		origItemCode,
		origQuantity,
		newItemCode,
		newQuantity,
		amount,
		exchange_reason,
		status
	} = req.body;
	db.transaction((trx) => {
		db.select('*').from('exchange_items').where({ 
			trx_id: trx_id,
			item_code: newItemCode,
			status: 'Pending'
		}).orWhere({
			trx_id: trx_id,
			item_code: newItemCode,
			status: 'Paid'
		})
		.then(data => {
			if(!data[0]){
				db('exchange_items')
				.returning('*')
				.insert({
					trx_id: trx_id,
					item_code: newItemCode,
					quantity: newQuantity,
					exchange_price: amount,
					status: status,
					exchange_date: new Date()
				})
				.then(insert => {
					if(insert[0]) {
						db('cart_item')
							.returning('*')
							.where({
								trx_id: trx_id,
								item_code: origItemCode
							})
							.update({
								status: 'Exchanged'
							})
							.then(update => {
								if (update[0]) {
									db.select('*').from('product').where('item_code', '=', origItemCode)
									.then(prod => {
										let newQuantity = '';
										newQuantity = parseInt(prod[0].stock) + parseInt(origQuantity);
										db('product')
											.returning('*')
											.where('item_code', '=', origItemCode)
											.update({
												stock: newQuantity
											})
											.then(quan => {
												db('activity_order_logs')
													.returning('*')
													.insert({
														date: new Date(),
														employee_id: req.session.emp_id,
														module: "EXCHANGE ITEM",
														trx_id: trx_id,
														activity: "Exchange",
													})
													.then(activity => {
														if (activity[0]) {
															db('cart_item')
																.returning('*')
																.where({
																	id: update[0].id,
																	trx_id: trx_id,
																	item_code: origItemCode
																})
																.update({
																	exch_id: insert[0].id,
																	return_reason: exchange_reason
																})
																.then(exch => {
																	if(exch[0]){
																		res.json({
																			isSuccess: true
																		});
																		return;
																	}
																	else {
																		res.json({
																			isSuccess: false
																		});
																		return;
																	}
																})
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
											})
											.then(trx.commit)
												.catch(err => {
													logger.error(1, err);
													trx.rollback;
													res.render('pages/error-500');
												});
									})
									.then(trx.commit)
									.catch(err => {
										logger.error(0, err);
										trx.rollback;
										res.render('pages/error-500');
									});
								}
								else {
									res.json({
										isSuccess: false
									});
									return;
								}
							})
							.then(trx.commit)
							.catch(err => {
								logger.error(2, err);
								trx.rollback;
								res.render('pages/error-500');
							});
					}
					else {
						res.json({
							isSuccess: false
						});
						return;
					}
				})
				.then(trx.commit)
				.catch(err => {
					logger.error(2, err);
					trx.rollback;
					res.render('pages/error-500');
				});
			}
			else {
				res.json({
					isSuccess: false
				});
				return;
			}
		})
		.then(trx.commit)
		.catch(err => {
			logger.error(1, err);
			trx.rollback;
			res.render('pages/error-500');
		});
	})
	.catch(err => logger.error(err));
}

module.exports = {
	populateTable,
	exchPopulateTable,
	submitItem,
	submitValue
}