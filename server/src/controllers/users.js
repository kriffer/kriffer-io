const {query} = require('../data/config');
const config = require('../data/config');
const crypto = require('crypto');
const logger = require('../logger');


module.exports.getUsers = async function getUsers(ctx, next) {
	logger.debug(ctx)
	const users = await query(`select u.id                 as userId,
                                      u.firstName          as firstName,
                                      u.lastName           as lastName,
                                      u.email              as email,
                                      u.password           as password,
                                      u.created            as created,
                                      u.active             as active,
                                      u.salt               as salt,
                                      u.verification_token as verificationToken
                               from user u;`);
	if (users) {
		ctx.body = users;
	} else {
		ctx.throw(404)
	}
};


module.exports.getUserById = async function getUserById(ctx, next) {
	logger.debug(ctx)

	const id = ctx.params.id;

	const user = await query(`select u.id                 as userId,
                                     u.firstName          as firstName,
                                     u.lastName           as lastName,
                                     u.email              as email,
                                     u.password           as password,
                                     u.created            as created,
                                     u.active             as active,
                                     u.salt               as salt,
                                     u.verification_token as verificationToken
                              from user u
                              where u.id = ?`, id);
	if (user) {
		ctx.body = user[0];
	} else {
		ctx.throw(404)
	}
};

module.exports.findUserById = async function findUserById(id) {

	const user = await query('select * from  user where id = ?', id);
	try {
		return user[0];
	} catch (err) {
		throw(err)
	}
};

module.exports.findUserByToken = async function findUserByToken(verificationToken) {

	const user = await query(`select *
                              from user
                              where verification_token = ?`, verificationToken);
	try {
		return user[0];
	} catch (err) {
		throw(err)
	}
};


module.exports.getUserByEmail = async function getUserByEmail(email) {

	const user = await query('select * from  user where email = ?', email);
	return user;
};

module.exports.createUser = async function createUser(firstName, lastName, email, passwordHash, salt, verificationToken) {

	const created = new Date();

	console.log(firstName, lastName, email, passwordHash, salt, verificationToken, created);
	try {

		await query(`INSERT INTO user (firstName, lastName, email, password, salt, verification_token, created)
                     VALUES (?, ?, ?, ?, ?, ?, ?) `,
			[firstName, lastName, email, passwordHash, salt, verificationToken, created]);


	} catch (err) {
		throw (err);
	}
};

module.exports.updateUser = async function updateUser(ctx, next) {
	logger.debug(ctx)
	const id = ctx.params.id;
	const {firstName, lastName, email, active, password} = ctx.request.body;
	try {

		await query('UPDATE  user SET firstName = ?,lastName = ?, email = ?, password = ?, active=? WHERE id = ?', [firstName, lastName, email, password, active, id]);

		ctx.status = 201;
		ctx.body = `User ${id} updated`;
	} catch (err) {
		ctx.throw(400);
	}
};

module.exports.deleteUser = async function deleteUser(ctx, next) {
	logger.debug(ctx)
	const id = ctx.params.id;
	try {
		await query(`UPDATE user
                     SET active = 0
                     WHERE id = ?`, id);
		ctx.status = 201;
		ctx.body = `User ${id} deleted`;
	} catch (err) {
		ctx.throw(400)
	}
};


async function generatePassword(salt, password) {
	return new Promise((resolve, reject) => {
		crypto.pbkdf2(
			password, salt,
			config.conf.crypto.iterations,
			config.conf.crypto.length,
			config.conf.crypto.digest,
			(err, key) => {
				if (err) return reject(err);
				resolve(key.toString('hex'));
			},
		);
	});
}

async function generateSalt() {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(config.conf.crypto.length, (err, buffer) => {
			if (err) return reject(err);
			resolve(buffer.toString('hex'));
		});
	});
}

async function setPassword(password) {
	const salt = await generateSalt();
	const passwordHash = await generatePassword(salt, password);
	return {passwordHash: passwordHash, salt: salt}
}

module.exports.setPassword = setPassword;

module.exports.checkPassword = async function (user, password) {

	const id = user[0].id;
	if (!password) return false;
	console.log('pass', password)
	const res = await query('select password, salt from user  WHERE id = ?', id);

	const hash = await generatePassword(res[0].salt, password);

	return hash === res[0].password;
};
