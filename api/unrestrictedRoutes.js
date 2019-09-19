"use strict";
const { transaction } = require("objection");
const User = require("../models/User");
//const Sessions = require("../models/Sessions");
const bcrypt = require("bcryptjs");

module.exports = router => {
	router.get("/", (req, res) => {
		res.json({ message: "API is up and running!" });
	});
	router.post("/register", async (req, res) => {
		const graph = req.body;
		const hash = await bcrypt.hash(graph.password, 10);
		const hasheduser = { username: graph.username, password: hash };
		let insertedUser;
		const user = await User.query().findOne({ username: graph.username });
		if (user) {
			res.status(404).send("username exists");
		}
		try {
			insertedUser = await transaction(User.knex(), trx => {
				return User.query(trx)
					.session(req.session)
					.insertGraph(hasheduser);
			});
			res.send({ username: insertedUser.username, id: insertedUser.id });
		} catch (err) {
			console.log(err instanceof objection.ValidationError);
			console.log(err.data);
		}
	});

	router.post("/login", async (req, res) => {
		const graph = req.body;
		let user;
		let passwordCheck;
		try {
			user = await User.query()
				.session(req.session)
				.findOne({ username: graph.username });
			User.query()
				.session((req.session.user = user))
				.session(console.log(req.session));
			if (user) {
				passwordCheck = await bcrypt.compare(
					graph.password,
					user.password
				);
				if (passwordCheck) {
					res.json({ user: user, pc: passwordCheck });
				} else {
					res.status(401).json({ message: "Invalid password" });
				}
			} else {
				res.status(401).send("invalid username");
			}
		} catch (err) {
			console.log(err instanceof objection.ValidationError);
			console.log(err.data);
		}
	});

	router.get("/logout", (req, res) => {
		if (req.session) {
			req.session.destroy(error => {
				if (error) {
					res.status(500).json({
						message:
							"you can check out anytime you like, but you can never leave"
					});
				} else {
					res.status(200).json({ message: "bye" });
				}
			});
		} else {
			res.status(200).json({ message: "already logged out" });
		}
	});
};

function createStatusCodeError(statusCode) {
	return Object.assign(new Error(), {
		statusCode
	});
}
