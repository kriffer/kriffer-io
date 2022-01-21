const {query} = require("../data/config");


module.exports.getCommentsByPost = async function getCommentsByPost(ctx, next) {
	const id = ctx.params.id;
	const comments = await query(`select c.name      as name,
                                      c.email     as email,
                                      c.id        as commentId,
                                      c.postId    as postId,
                                      c.createdAt as createdAt,
                                      c.content   as content,
                                      c.parentId     parentId
                               from post_comment c
                            
                               where c.postId = ?;`, id)
	if (comments) {
		ctx.body = comments;
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