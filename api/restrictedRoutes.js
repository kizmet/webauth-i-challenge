"use strict";
const { transaction } = require("objection");
const User = require("../models/User");
const Sessions = require("../models/Sessions");
const bcrypt = require("bcryptjs");
const RestrictedSession = require("../auth/restricted-session");

module.exports = router => {
	router.get("/users", RestrictedSession, (req, res) => {
		const getusers = async () => {
			const users = await transaction(User.knex(), trx => {
				return User.query(trx);
			});
			res.send(users);
		};
		return getusers();
	});
};

function createStatusCodeError(statusCode) {
	return Object.assign(new Error(), {
		statusCode
	});
}
