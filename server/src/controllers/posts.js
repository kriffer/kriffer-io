const {query} = require('../data/config');


module.exports.getPosts = async function getPosts(ctx, next) {
	const posts = await query(`select p.id        as postId,
                                      p.slug      as slug,
                                      p.summary   as summary,
                                      p.createdAt as createdAt,
                                      p.content   as content,
                                      u.firstName as firstName,
                                      u.lastName  as lastName
                               from post p
                                        left join user u on p.authorId = u.id;`);
	if (posts) {
		ctx.body = posts;
	} else {
		ctx.throw(404)
	}

}

module.exports.getPostsByCategory = async function getPostsByCategory(ctx, next) {
	const id = ctx.params.id;
	const posts = await query(`select p.id        as postId,
                                      p.slug      as slug,
                                      p.summary   as summary,
                                      p.createdAt as createdAt,
                                      p.content   as content,
                                      u.firstName as firstName,
                                      u.lastName  as lastName

                               from user u
                                        join post p on p.authorId = u.id
                                        join post_category pc on p.id = pc.postId
                                        join category c on c.id = pc.categoryId
                               where c.id = ?;`, id);
	if (posts) {
		ctx.body = posts;
	} else {
		ctx.throw(404)
	}

}


module.exports.getPostsByTag = async function getPostsByTag(ctx, next) {
	const id = ctx.params.id;
	const posts = await query(`select p.id        as postId,
                                      p.slug      as slug,
                                      p.summary   as summary,
                                      p.createdAt as createdAt,
                                      p.content   as content,
                                      u.firstName as firstName,
                                      u.lastName  as lastName
                               from user u
                                        join post p on p.authorId = u.id
                                        join post_tag pt on p.id = pt.postId
                                        join tag t on t.id = pt.tagId
                               where t.id = ?;`, id);
	if (posts) {
		ctx.body = posts;
	} else {
		ctx.throw(404)
	}

}


// Display a single post by ID
module.exports.getPostById = async function getPostById(ctx, next) {
	const id = ctx.params.id;
	const post = await query('select * from post  where post.id = ?;', id)
	if (post) {
		ctx.body = post;
	} else {
		ctx.throw(404)
	}
}

// Display a single post by slug
module.exports.getPostBySlug = async function getPostBySlug(ctx, next) {
	const slug = ctx.params.slug;
	const post = await query(`select post.id        as postId,
                                     post.slug      as slug,
                                     post.summary   as summary,
                                     post.createdAt as createdAt,
                                     post.updatedAt as updatedAt,
                                     post.content   as content,
                                     post.authorId  as authorId,
                                     user.firstName as firstName,
                                     user.lastname  as lastName
                              from post
                                       left join user on post.authorId = user.id
                              where post.slug = ?;`, slug)
	if (post) {
		ctx.body = post;
	} else {
		ctx.throw(404)
	}
}

// Create post
module.exports.createPost = async function createPost(ctx, next) {
	console.log(ctx.request.body)
	try {
		const id = await query('INSERT INTO post SET ?', ctx.request.body).then(
			await query('select LAST_INSERT_ID();')
		)
		ctx.status = 201;
		ctx.body = {'id': id.insertId}
	} catch (err) {
		console.log(err);
		ctx.throw(400);
	}
}


// Update an existing post
module.exports.updatePost = async function updatePost(ctx, next) {
	try {
		const id = ctx.params.id;
		const r = ctx.request.body;
		await query('UPDATE post SET ? WHERE id = ?', [r, id]);
		ctx.status = 201;
		ctx.body = `updated id${id} successfully`;
	} catch (err) {
		ctx.body = {
			status: 'error',
			message: err.message || 'Sorry, an error has occurred.'
		};
	}
}

// Delete post
module.exports.deletePost = async function deletePost(ctx, next) {
	try {
		const id = ctx.params.id;
		await query('DELETE FROM post WHERE id = ?', id);
		ctx.status = 200;
		ctx.body = `post with id${id} is deleted`
	} catch (err) {
		ctx.body = {
			status: 'error',
			message: err.message || 'Sorry, an error has occurred.'
		};
	}

}



