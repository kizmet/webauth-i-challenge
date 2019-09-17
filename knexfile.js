// Update with your config settings.

module.exports = {
	development: {
		client: "sqlite3",
		pool: {
			afterCreate: (conn, cb) => {
				conn.run("PRAGMA foreign_keys = ON", cb);
			}
		},
		useNullAsDefault: true,
		connection: {
			filename: "data/dev.sqlite3"
		},
		migrations: {
			tableName: "knex_migrations",
			directory: "./migrations"
		},
		debug: true,
		asyncStackTraces: true
	}
};
