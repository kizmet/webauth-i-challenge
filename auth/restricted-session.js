module.exports = restrictedSession;
function restrictedSession(req, res, next) {
	console.log(req.session);
	if (req.session && req.session.cookie) {
		next();
	} else {
		res.status(401).json({ message: "You shall not pass!" });
		//res.redirect("/");
	}
}
