const {query} = require('../data/config');


module.exports.createSession = async function createSession(token, user, lastVisit) {

	try {
		await query('INSERT INTO session (token, user_id, last_visit) VALUES(?,?, ?) ',
			[token, user.id, lastVisit]);

	} catch (err) {
		throw(err);
	}
};


module.exports.findSessionByToken = async function findSessionByToken(token) {

	const res = await query('select * from session where token = ?', token);
	return res[0];
};


module.exports.updateSession = async function updateSession(session, lastVisit) {

	try {

		await query('UPDATE session SET last_visit =?  WHERE id = ?', [lastVisit, session.id]);


	} catch (err) {
		throw(err);
	}
};