const {KoaPassport} = require('koa-passport');
const passport = new KoaPassport();

const LocalStrategy = require('passport-local').Strategy;
const {getUserByEmail} = require("../controllers/users");
const {checkPassword} = require("../controllers/users");



const local = new LocalStrategy(
	{usernameField: 'email', session: false},
	async function(email, password, done) {
		try {
			const user = await getUserByEmail(email);
			if (!user) {
				return done(null, false, 'No such user');
			}

			const isValidPassword = await checkPassword(user, password);

			if (!isValidPassword) {
				return done(null, false, 'Wrong password');
			}

			return done(null, user);
		} catch (err) {
			done(err);
		}
	},
);

passport.use(local);

module.exports = passport;