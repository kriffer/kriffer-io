const {setPassword, createUser} = require('./users');

const {query} = require('../data/config');


module.exports.register = async (ctx, next) => {
	const email = ctx.request.body.email;
	const firstName = ctx.request.body.firstName;
	const lastName = ctx.request.body.lastName;
	console.log(ctx.request.body)

	const count = await query('select count(email) as count  from user where email=?', email);
	console.log(count[0].count)
	if (count[0].count >= 1) {
		ctx.throw(400, 'This email already exists');
	}
	const {passwordHash, salt} = await setPassword(ctx.request.body.password);
	await createUser(firstName, lastName, email, passwordHash, salt, null);


	ctx.body = {status: 'ok'};
};


