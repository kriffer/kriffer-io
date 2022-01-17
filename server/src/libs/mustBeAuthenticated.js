module.exports = function mustBeAuthenticated(ctx, next) {
    if (!ctx.user) {
      ctx.throw(401, 'Not logged in');
    }
    return next();
  };
  