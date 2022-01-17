const mysql = require('mysql');

// Set database connection credentials
const conf = {
	connectionString: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME
	},

	crypto: {
		iterations: (process.env.NODE_ENV === 'development' ? 1 : 12000),
		length: 128,
		digest: 'sha512',
	},
};

const pool = mysql.createPool(conf.connectionString);

let query = function (sql, values) {
	return new Promise((resolve, reject) => {
		pool.getConnection(function (err, connection) {
			if (err) {
				reject(err)
			} else {
				connection.query(sql, values, (err, rows) => {
					if (err) {
						reject(err)
					} else {
						resolve(rows)
					}
					connection.release()
				})
			}
		})
	})
}

// Export the pool
module.exports = {query, conf};
