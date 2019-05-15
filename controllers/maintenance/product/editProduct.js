const dbEditProduct = (req, res, db, logger, fs, imagePath) => {
	let {
		prodCode,
		prodOrigImage,
		productCode,
		productType,
		productDesc,
		productPrice,
		productStock,
		productImage,
		productCourse
	} = req.body;
	let flag = false;
	switch (productImage == '') {
		case false:
			productImage = productImage.split('\\').pop();
			flag = false;
			console.log('flag is', flag, 'Image is changed', productImage);
			break;
		case true:
			console.log('image not changed', prodOrigImage);
			flag = true;
			break;
	}
	if (!productType || !productDesc || !productPrice || !productStock || !productCourse) {
		res.json({
			haveEmpty: true
		});
		return;
	}
	let type_id = '';
	db.transaction((trx) => {
			db.select('id').from('product_type').where('type', '=', productType)
				.then(data => {
					if (data[0]) {
						switch (flag) {
							case false:
								if(prodOrigImage == 'default.jpg') {
									break;
								}
								else if(prodOrigImage == productImage) {
									break;
								}
								else {
									fs.unlinkSync(imagePath + prodOrigImage);
									break;
								}
							case true:
								break;
						}
						type_id = data[0].id;
						db('product')
							.returning('*')
							.where('item_code', '=', prodCode)
							.update({
								item_code: productCode,
								item_description: productDesc,
								price: productPrice,
								stock: productStock,
								image: flag ? prodOrigImage : productImage
							})
							.then(product => {
								return db.transaction(trx => {
								db('product_category')
								.returning('*')
								.where('product_id', '=', product[0].id)
								.del()
								.transacting(trx) // This makes every update be in the same transaction
				        .then(trx.commit) // We try to execute all of them
				        .catch(trx.rollback); // And rollback in case any of them goes wrong
								})
								.then(prodCat => {
									let fieldsToInsert = productCourse.map(fields => {
									fields.product_id = product[0].id;
									fields.type_id = type_id;
									return fields;
								});
									db('product_category')
									.returning('*')
									.insert(fieldsToInsert)
									.then(activity => {
										db('activity_logs')
											.returning('*')
											.insert({
												date: new Date(),
												employee_id: req.session.emp_id,
												module: "PRODUCT",
												activity: "EDIT"
											})
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
								})
								.then(trx.commit)
									.catch(err => {
										logger.error(err);
										trx.rollback;
										res.render('pages/error-500');
									});
							})
							.then(trx.commit)
							.catch(err => {
								logger.error(err);
								trx.rollback;
								res.render('pages/error-500');
							});
					} else {
						res.json('Product already Exist!');
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
	dbEditProduct
}