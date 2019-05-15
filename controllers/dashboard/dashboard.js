const bookList = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('product_view').where('type', '=', 'Books')
				.then(data => {
					if (data[0]) {
						let totalProduct = data.length,
							pageSize = 6,
							pageCount = Math.round(data.length / pageSize),
							currentPage = 1,
							product = data,
							productArrays = [],
							productList = [];

						while (product.length > 0) {
							productArrays.push(product.splice(0, pageSize));
						}

						if (typeof req.query.page !== 'undefined') {
							currentPage = +req.query.page;
						}

						productList = productArrays[+currentPage - 1];

						res.render('pages/back/prodview/books', {
							id: req.session.user.id,
							position: req.session.position,
							product: productList,
							pageSize: pageSize,
							totalProduct: totalProduct,
							pageCount: pageCount,
							currentPage: currentPage
						});
						return;
					} else {
						res.render('pages/error-500');
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

const prowareList = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('product_view').where('type', '=', 'Proware')
				.then(data => {
					if (data[0]) {
						let totalProduct = data.length,
							pageSize = 6,
							pageCount = Math.round(data.length / pageSize),
							currentPage = 1,
							product = data,
							productArrays = [],
							productList = [];

						while (product.length > 0) {
							productArrays.push(product.splice(0, pageSize));
						}

						if (typeof req.query.page !== 'undefined') {
							currentPage = +req.query.page;
						}

						productList = productArrays[+currentPage - 1];

						res.render('pages/back/prodview/proware', {
							id: req.session.user.id,
							position: req.session.position,
							product: productList,
							pageSize: pageSize,
							totalProduct: totalProduct,
							pageCount: pageCount,
							currentPage: currentPage
						});
						return;
					} else {
						res.render('pages/error-500');
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

const uniformList = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('product_view').where('type', '=', 'Uniform')
				.then(data => {
					if (data[0]) {
						let totalProduct = data.length,
							pageSize = 6,
							pageCount = Math.round(data.length / pageSize),
							currentPage = 1,
							product = data,
							productArrays = [],
							productList = [];

						while (product.length > 0) {
							productArrays.push(product.splice(0, pageSize));
						}

						if (typeof req.query.page !== 'undefined') {
							currentPage = +req.query.page;
						}

						productList = productArrays[+currentPage - 1];

						res.render('pages/back/prodview/uniform', {
							id: req.session.user.id,
							position: req.session.position,
							product: productList,
							pageSize: pageSize,
							totalProduct: totalProduct,
							pageCount: pageCount,
							currentPage: currentPage
						});
						return;
					} else {
						res.render('pages/error-500');
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

const searchUniform = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('product_view').where('type', '=', 'Uniform').andWhere('item_description', 'ilike', '%' + req.query.product + '%')
				.then(data => {
					if (data[0]) {
						let totalProduct = data.length,
							pageSize = 6,
							pageCount = Math.round(data.length / pageSize),
							currentPage = 1,
							product = data,
							productArrays = [],
							productList = [];

						while (product.length > 0) {
							productArrays.push(product.splice(0, pageSize));
						}

						if (typeof req.query.page !== 'undefined') {
							currentPage = +req.query.page;
						}

						productList = productArrays[+currentPage - 1];

						res.render('pages/back/prodview/search', {
							id: req.session.user.id,
							position: req.session.position,
							product: productList,
							pageSize: pageSize,
							totalProduct: totalProduct,
							pageCount: pageCount,
							currentPage: currentPage
						});
						return;
					} else {
						res.render('pages/error-500');
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

const searchProware = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('product_view').where('type', '=', 'Proware').andWhere('item_description', 'ilike', '%' + req.query.product + '%')
				.then(data => {
					if (data[0]) {
						let totalProduct = data.length,
							pageSize = 6,
							pageCount = Math.round(data.length / pageSize),
							currentPage = 1,
							product = data,
							productArrays = [],
							productList = [];

						while (product.length > 0) {
							productArrays.push(product.splice(0, pageSize));
						}

						if (typeof req.query.page !== 'undefined') {
							currentPage = +req.query.page;
						}

						productList = productArrays[+currentPage - 1];

						res.render('pages/back/prodview/search', {
							id: req.session.user.id,
							position: req.session.position,
							product: productList,
							pageSize: pageSize,
							totalProduct: totalProduct,
							pageCount: pageCount,
							currentPage: currentPage
						});
						return;
					} else {
						res.render('pages/error-500');
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

const searchBook = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('product_view').where('type', '=', 'Books').andWhere('item_description', 'ilike', '%' + req.query.product + '%')
				.then(data => {
					if (data[0]) {
						let totalProduct = data.length,
							pageSize = 6,
							pageCount = Math.round(data.length / pageSize),
							currentPage = 1,
							product = data,
							productArrays = [],
							productList = [];

						while (product.length > 0) {
							productArrays.push(product.splice(0, pageSize));
						}

						if (typeof req.query.page !== 'undefined') {
							currentPage = +req.query.page;
						}

						productList = productArrays[+currentPage - 1];

						res.render('pages/back/prodview/search', {
							id: req.session.user.id,
							position: req.session.position,
							product: productList,
							pageSize: pageSize,
							totalProduct: totalProduct,
							pageCount: pageCount,
							currentPage: currentPage
						});
						return;
					} else {
						res.render('pages/error-500');
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
	bookList,
	prowareList,
	uniformList,
	searchUniform,
	searchProware,
	searchBook
}