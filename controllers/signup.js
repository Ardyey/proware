const initializeFields = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('position').where('description', '!=', 'Admin').orderBy('id')
				.then(data => {
					if (data[0]) {
						res.render('pages/back/register', {
							position: data
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

const superInitializeFields = (req, res, db, logger) => {
	db.transaction((trx) => {
			db.select('*').from('position').orderBy('id')
				.then(data => {
					if (data[0]) {
						res.render('pages/back/register', {
							position: data
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

const handleSignup = (req, res, db, logger, bcrypt) => {
	const {
		employeeId,
		username,
		password,
		firstName,
		lastName,
		positionSelect
	} = req.body;
	const hash = bcrypt.hashSync(password);
	if (!employeeId || !username || !password || !firstName || !lastName || !positionSelect) {
		res.json({
			haveEmpty: true
		});
		return;
	}
	
	const selectUser = (trx) => {
		return trx
		.select('*')
		.from('user')
		.where('employee_id', '=', employeeId)
	}

	const insertUser = (trx) => {
		return trx('user')
		.returning('*')
		.insert({
			employee_id: employeeId,
			username: username,
			first_name: firstName,
			last_name: lastName,
			status: "Active",
			position_id: positionSelect
		})
	}

	const insertLogin = (trx) => {
		return trx('login')
		.returning('*')
		.insert({
			employee_id: employeeId,
			username: username,
			hash: hash
		})
	}

	const sendResponse = (result) => {
		if (result[0]) {
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
			const select = await selectUser(trx);
			if(select[0]){
				res.json({isSuccess: false});
				return;
			}
			else{
				const user = await insertUser(trx).catch(err => {throw err});
				const login = await insertLogin(trx).catch(err => {throw err});
				const res = await sendResponse(login);
			}
		})
	})().catch(err => {
			console.log(err);
			res.json({ isSuccess: false })
		});

}

module.exports = {
	initializeFields,
	superInitializeFields,
	handleSignup
}