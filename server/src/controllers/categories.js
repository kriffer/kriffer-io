const {query} = require('../data/config');


// Get all categories
module.exports.getCategories = async function getCategories(ctx, next) {
	const categories = await query(`select c.id    as categoryId,
                                           c.title as categoryTitle,
                                           p.id    as postId
                                    from category c
                                             join post_category pc on c.id = pc.categoryId
                                             join post p on p.id = pc.postId;  `);
	if (categories) {
		ctx.body = categories;
	} else {
		ctx.throw(404)
	}

}

module.exports.getCategoriesByPost = async function getCategoriesByPost(ctx, next) {
	const id = ctx.params.id;
	const categories = await query(`select c.id    as categoryId,
                                           c.title as categoryTitle,
                                           p.id    as postId
                                    from category c
                                             join post_category pc on c.id = pc.categoryId
                                             join post p on p.id = pc.postId
                                    where p.id = ?;`, id);
	if (categories) {
		ctx.body = categories;
	} else {
		ctx.throw(404)
	}


}

// Add a new category
module.exports.createCategory = async function createCategory(ctx, next) {
	try {
		const id = await query('INSERT INTO category SET ?', ctx.request.body).then(
			await query('select LAST_INSERT_ID();')
		)
		ctx.status = 201;

		ctx.body = {'id': id.insertId};
	} catch (err) {
		ctx.throw(400);
	}
}

// Create categoriesposts
module.exports.createCategoriesPosts = async function createCategoriesPosts(ctx, next) {
	try {
		await query('INSERT INTO post_category SET ?', ctx.request.body)
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


module.exports.deleteCategoriesPostsByPost = async function deleteCategoriesPcreostsByPost(ctx, next) {
	try {
		const id = ctx.params.id;
		await query('DELETE FROM post_category WHERE postId = ?', id);
		ctx.status = 200;
		ctx.body = `post_category with postid${id} is deleted`
	} catch (err) {
		ctx.body = {
			status: 'error',
			message: err.message || 'Sorry, an error has occurred.'
		};
	}

};


module.exports.deleteCategoriesPostsByPostByCategory = async function deleteCategoriesPostsByPostByCategory(ctx, next) {
	try {
		const postId = ctx.params.postId;
		const categoryId = ctx.params.categoryId;
		await query('DELETE FROM post_category WHERE postId = ? and categoryId = ?', [postId, categoryId]);
		ctx.status = 200;
		ctx.body = `category_tags with postid ${postId} and categoryId ${categoryId} is deleted`
	} catch (err) {
		ctx.body = {
			status: 'error',
			message: err.message || 'Sorry, an error has occurred.'
		};
	}

};