"use strict";
const { transaction } = require("objection");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

module.exports = router => {
	router.post("/api/register", async (req, res) => {
		const graph = req.body;
		const hash = await bcrypt.hash(graph.password, 10);
		const hasheduser = { username: graph.username, password: hash };
		let insertedUser;
		const user = await User.query().findOne({ username: graph.username });
		if (user) {
			//throw createStatusCodeError(404, "username exists");
			res.status(404).send("username exists");
		}
		try {
			insertedUser = await transaction(User.knex(), trx => {
				return User.query(trx).insertGraph(hasheduser);
			});
			res.send({ username: insertedUser.username, id: insertedUser.id });
		} catch (err) {
			console.log(err instanceof objection.ValidationError);
			console.log(err.data);
		}
	});

	router.post("/api/login", async (req, res) => {
		const graph = req.body;
		const user = await User.query().findOne({ username: graph.username });
		let passwordCheck;
		if (!user) {
			res.status(401).send("invalid login");
		}
		try {
			passwordCheck = await bcrypt.compare(graph.password, user.password);
			console.log(passwordCheck);
		} catch (err) {
			console.log(err instanceof objection.ValidationError);
			console.log(err.data);
		}

		res.send(passwordCheck);
	});

	//uses middleware function restricted in api.js
	router.get("/users", restricted, (req, res) => {
		const getusers = async () => {
			const users = await transaction(User.knex(), trx => {
				return User.query(trx);
			});
			res.send(users);
		};
		return getusers();
	});

	//uses global middleware from app.js
	router.get("/api/restricted/users", async (req, res) => {
		const users = await User.query();

		res.send(users);
	});
};

function createStatusCodeError(statusCode) {
	return Object.assign(new Error(), {
		statusCode
	});
}

async function restricted(req, res, next) {
	const { username, password } = req.headers;
	const user = await User.query().findOne({ username: username });
	let passwordCheck;
	if (!user) {
		res.status(401).send("invalid username");
	}
	try {
		passwordCheck = await bcrypt.compare(password, user.password);

		passwordCheck
			? next()
			: res.status(401).json({ message: "Invalid password" });
	} catch (err) {
		console.log(err instanceof objection.ValidationError);
		console.log(err.data);
	}
}
