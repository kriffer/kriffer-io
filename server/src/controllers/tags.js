const {query} = require('../data/config');


// Get all tags

module.exports.getTags = async function getTags(ctx, next) {
	const tags = await query(`select t.id    as tagId,
                                     t.title as tagTitle
                              from tag t;`);
	if (tags) {
		ctx.body = tags;
	} else {
		ctx.throw(404)
	}


}


module.exports.getTagsByPost = async function getTagsByPost(ctx, next) {
	const id = ctx.params.id;
	const tags = await query(`select t.id    as tagId,
                                     t.title as tagTitle
                              from tag t
                                       join post_tag pt on pt.tagId = t.id
                                       join post p on p.id = pt.postId
                              where p.id = ?;`, id);
	if (tags) {
		ctx.body = tags;
	} else {
		ctx.throw(404)
	}


}


// Add a new tag
module.exports.createTag = async function createTag(ctx, next) {
	try {
		const id = await query('INSERT INTO tag SET ?', ctx.request.body).then(
			await query('select LAST_INSERT_ID();')
		)
		ctx.status = 201;

		ctx.body = {'id': id.insertId};
	} catch (err) {
		ctx.throw(400);
	}
}


// Create tagsposts
module.exports.createTagsPosts = async function createTagsPosts(ctx, next) {
	try {
		await query('INSERT INTO post_tag SET ?', ctx.request.body)
		ctx.status = 201;
		ctx.body = 'ok';
	} catch (err) {
		if (JSON.parse(JSON.stringify(err)).code === ('ER_DUP_ENTRY')) {
			ctx.body = 'record already exists';
		} else {
			ctx.throw(400);
		}
	}
}

module.exports.deleteTagsPosts = async function deleteTagsPosts(ctx, next) {
	try {
		const postId = ctx.params.postId;
		const tagId = ctx.params.tagId;
		await query('DELETE FROM post_tag WHERE postId = ? and tagId = ?', [postId, tagId]);
		ctx.status = 200;
		ctx.body = `post_tags with postid ${postId} and tagId ${tagId} is deleted`
	} catch (err) {
		ctx.body = {
			status: 'error',
			message: err.message || 'Sorry, an error has occurred.'
		};
	}

}


module.exports.deleteTagsPostsByPost = async function deleteTagsPostsByPost(ctx, next) {
	try {
		const id = ctx.params.id;
		await query('DELETE FROM post_tag WHERE postId = ?', id);
		ctx.status = 200;
		ctx.body = `post_tags with postid${id} is deleted`
	} catch (err) {
		ctx.body = {
			status: 'error',
			message: err.message || 'Sorry, an error has occurred.'
		};
	}

}

