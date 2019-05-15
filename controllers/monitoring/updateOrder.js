const updateOrder = (req, res, db, logger) => {
	let {
		status,
		trx_id,
		orNumber,
		returnReason
	} = req.body;

	const updateStatus = (trx) => {
		return trx('cart')
				.returning('*')
				.where('trx_id', '=', trx_id)
				.update({
					status: status,
					or_num: orNumber,
					return_reason: returnReason
				});
	}

	const updateDate = (trx) => {
		return trx('cart')
			.returning('*')
			.where('trx_id', '=', trx_id)
			.update({
				date_purchased: new Date()
			});
	}

	const selectItems = (trx, order) => {
		return trx
			.select('*')
			.from('cart_item')
			.where({
				cart_id: order.id,
				trx_id: order.trx_id
			});
	}

	const selectProduct = (trx, item) => {
		const queries = [];
		item.forEach(item => {
			const query = trx.select('*')
			.from('product')
			.where('item_code', '=', item.item_code);
			queries.push(query);
		})
		return Promise.all(queries);
	}

	const updateQuantity = (trx, product, cart) => {
		const prodQuantity = product.map(product => parseInt(product.stock));
		const cartQuantity = cart.map(cart => parseInt(cart.quantity));
		const newQuantity = [];
		const queries = [];
		for(let i = 0; i < product.length; i++){
			newQuantity.push(prodQuantity[i] - cartQuantity[i]);
		}
		cart.map((cart, index) => {
			const query = trx('product')
			.returning('*')
			.where('item_code', '=', cart.item_code)
			.update({
				stock: newQuantity[index]
			})
			queries.push(query);
		})
	  return queries;
	}

	const updateLogs = (trx) => {
		return trx('activity_order_logs')
			.returning('*')
			.insert({
				date: new Date(),
				employee_id: req.session.emp_id,
				module: "MONITORING",
				trx_id: trx_id,
				activity: status,
				or_num: orNumber
			})
	}

	const sendResponse = (result) => {
		if (result) {
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
	}

	(async () => {
		const trx = await db.transaction(async (trx) => {
	  const first = await updateStatus(trx);
	  // console.log(first);
	  if(first[0].status == 'Success'){
	  	const second = await updateDate(trx).catch(err => {throw err});
	  	// console.log(second);	
	  	const third = await selectItems(trx, second[0]).catch(err => {throw err});
	  	// console.log(third);
	  	const fourth = await selectProduct(trx, third).catch(err => {throw err});
	  	const fourth2 = [].concat(...fourth);
	  	// console.log(fourth2);
	  	const fifth = await updateQuantity(trx, fourth2, third)
	  	const decreaseStock = async () => {
			const finalResult = [];
  		for (let i = 0; i < fifth.length; i++) {
				const finalQuery = await Promise.resolve(fifth[i]);
				finalResult.push(finalQuery);
			}
				return finalResult;
		  };

		  const result = await decreaseStock(trx).catch(err => {throw err});
		  const result2 = [].concat(...result);
		  const logs = await updateLogs(trx).catch(err => {throw err});
		  const sendRes = await sendResponse(logs);

	  } else if(first[0].status == 'Returned'){
	  	const logs = await updateLogs(trx).catch(err => {throw err});
		  const sendRes = await sendResponse(logs);
	  } else {
	  	const logs = await updateLogs(trx).catch(err => {throw err});
		  const sendRes = await sendResponse(logs);
	  }
	})
	})().catch(err => {
			console.log(err);
			res.json({ isSuccess: false })
		});
}

module.exports = {
	updateOrder
}