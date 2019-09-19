"use strict";

//const sessionPlugin = require("./Sessions");
const Session = require("./Sessions")({
	setCreatedBy: true,
	setModifiedBy: true
});

//const { Model } = require("objection");
const Model = require("objection").Model;
// class User extends Model {
// 	static get tableName() {
// 		return "users";
// 	}
// }

class User extends Session(Model) {
	static get tableName() {
		return "users";
	}
}

module.exports = User;
