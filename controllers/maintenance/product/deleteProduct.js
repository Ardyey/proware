const dbDeleteProduct = (req, res, db, logger, fs, imagePath) => {
	let {
		productCode
	} = req.body;
	db.transaction((trx) => {
			db('product')
				.returning('*')
				.where('item_code', '=', productCode)
				.del()
				.then(data => {
					if (data[0]) {
						db('activity_logs')
							.returning('*')
							.insert({
								date: new Date(),
								employee_id: req.session.emp_id,
								module: "PRODUCT",
								activity: "DELETE"
							})
							.then(activity => {
								if (activity[0]) {
									if (data[0].image == 'default.jpg') {
										res.json({
											isSuccess: true
										});
										return;
									} else {
										db('product').count('image').where('image', '=', data[0].image)
											.then(result => {
												if (result[0].count + 1 == 1) {
													fs.unlinkSync(imagePath + data[0].image);
													res.json({
														isSuccess: true
													});
													return;
												} else {
													res.json({
														isSuccess: true
													});
													return;
												}
											})
											.then(trx.commit)
											.catch(err => {
												console.log(1, err);
												logger.error(err);
												trx.rollback;
												res.render('pages/error-500');
											});
									}
								}
							})
							.then(trx.commit)
							.catch(err => {
								console.log(2, err);
								logger.error(err);
								trx.rollback;
								res.render('pages/error-500');
							});
					} else {
						res.json({
							isSuccess: false
						});
						return;
					}
				})
				.then(trx.commit)
				.catch(err => {
					console.log(3, err);
					logger.error(err);
					trx.rollback;
					res.render('pages/error-500');
				});
		})
		.catch(err => logger.error(1, err));
}

module.exports = {
	dbDeleteProduct
}