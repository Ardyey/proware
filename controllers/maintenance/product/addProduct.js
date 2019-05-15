const dbAddProduct = (req, res, db, logger, multer) => {
	let {
		productCode,
		productType,
		productDesc,
		productPrice,
		productStock,
		productImage,
		productCourse
	} = req.body;

	if (!productImage) {
		productImage = 'default.jpg';
	} else {
		productImage = productImage.split('\\').pop();
	}
	if (!productType || !productDesc || !productPrice || !productStock || !productCourse) {
		res.json({
			haveEmpty: true
		});
		return;
	}

	//util throw error
	const breakWithError = (err) => {
		throw new Error(err);
	}

	let type_id = '';
	db.transaction((trx) => {
			db.select('id').from('product_type').where('type', '=', productType)
				.then(data => {
					if (data[0]) {
						type_id = data[0].id;
						db.select('*').from('product').where('item_code', '=', productCode)
							.then(data => {
								if (data[0]) {
									breakWithError('EXISTING');
								}
								return db('product')
									.returning('*')
									.insert({
										item_code: productCode,
										item_description: productDesc,
										price: productPrice,
										stock: productStock,
										image: productImage
									})
							})
							.then(product => {
								let fieldsToInsert = productCourse.map(fields => {
									fields.product_id = product[0].id;
									fields.type_id = type_id;
									return fields;
								});
								return db('product_category')
									.returning('*')
									.insert(fieldsToInsert)
							})
							.then(prodCat => {
								return db('activity_logs')
									.returning('*')
									.insert({
										date: new Date(),
										employee_id: req.session.emp_id,
										module: "PRODUCT",
										activity: "ADD"
									})
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
					}
				})
				.then(trx.commit)
				.catch(err => {
					if(err.message == 'EXISTING'){
						res.json('Product already Exist!');
						return;
					}
					logger.error(err);
					trx.rollback;
					res.render('pages/error-500');
				});
		})
		.catch(err => logger.error(err));
}

module.exports = {
	dbAddProduct
}