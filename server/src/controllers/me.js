module.exports.me = async function me(ctx, next) {
	ctx.body = {
		userId: ctx.user.id,
		email: ctx.user.email,
		firstName: ctx.user.firstName,
		lastName: ctx.user.lastName,
	};
};
  