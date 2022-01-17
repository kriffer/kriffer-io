const {query} = require("../data/config");


module.exports.getCommentsByPost = async function getCommentsByPost(ctx, next) {
	const id = ctx.params.id;
	const users = await query(`select u.firstName as firstName,
                                      u.lastName  as lastName,
                                      c.id        as commentId,
                                      c.postId    as postId,
                                      c.createdAt as createdAt,
                                      c.content   as content,
                                      c.parentId     parentId
                               from post_comment c
                                        join user u on u.id = c.userId
                               where c.postId = ?;`, id)
	if (users) {
		ctx.body = users;
	} else {
		ctx.throw(404)
	}
}


// Add a new comment
module.exports.createComment = async function createComment(ctx, next) {
	try {
		const id = await query('INSERT INTO post_comment SET ?', ctx.request.body).then(
			await query('select LAST_INSERT_ID();')
		)
		ctx.status = 201;

		ctx.body = {'id': id.insertId};
	} catch (err) {
		ctx.throw(400);
	}
}