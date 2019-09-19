exports.up = knex => {
	return knex.schema.table("users", table => {
		table.string("createdBy");
		table.string("createdAt");
		table.string("modifiedBy");
		table.string("modifiedAt");
	});
};

exports.down = knex => {
	return knex.schema.dropTableIfExists("users");
};
