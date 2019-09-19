const bcrypt = require("bcryptjs");

const User = require("../models/User");

module.exports = restricted;

//check password in header
async function restricted(req, res, next) {
	const graph = req.body;
	const user = await User.query().findOne({ username: graph.username });
	let passwordCheck;
	if (!user) {
		res.status(401).send("invalid username");
	}
	try {
		passwordCheck = await bcrypt.compare(graph.password, user.password);
		passwordCheck
			? next()
			: res.status(401).json({ message: "Invalid password" });
	} catch (err) {
		console.log(err instanceof objection.ValidationError);
		console.log(err.data);
	}
}
