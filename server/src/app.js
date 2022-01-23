// Require packages and set the port
const Koa = require('koa');
require('dotenv').config();
const path = require('path');
const port = 3002;
const cors = require('@koa/cors');
const Router = require('koa-router');
const app = new Koa()
const {v4: uuid} = require('uuid');
const {login} = require('./controllers/login');
const {register} = require('./controllers/registration');
const mustBeAuthenticated = require('./libs/mustBeAuthenticated');
const {getUsers, createUser, getUserById, updateUser, deleteUser, findUserById} = require('./controllers/users');
const {
	createCategory,
	deleteCategoriesPostsByPost,
	deleteCategoriesPostsByPostByCategory,
	getCategories,
	getCategoriesByPost,
	createCategoriesPosts
} = require('./controllers/categories');
const {
	getTags,
	createTag,
	getTagsByPost,
	deleteTagsPosts,
	deleteTagsPostsByPost,
	createTagsPosts
} = require('./controllers/tags');

const {
	getCommentsByPost, createComment

} = require('./controllers/comments');

const {
	getPosts,
	getPostsByCategory,
	getPostsByTag,
	createPost,
	getPostBySlug,
	getPostById,
	updatePost,
	deletePost
} = require('./controllers/posts');

const {createSession, findSessionByToken, updateSession} = require('./controllers/sessions');

const {me} = require('./controllers/me');


app.use(require('koa-bodyparser')());
app.use(cors());

app.use(async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		if (err.status) {
			ctx.status = err.status;
			ctx.body = {error: err.message};
		} else {
			console.error(err);
			ctx.status = 500;
			ctx.body = {error: 'Internal server error'};
		}
	}
});

app.use((ctx, next) => {
	ctx.login = async function (user) {
		const token = uuid();
		await createSession(token, user[0], new Date());
		return token;
	};

	return next();
});


const router = new Router({prefix: '/api/v1'});

router.use(async (ctx, next) => {
	const header = ctx.request.get('Authorization');
	if (!header) return next();

	const token = header.split(' ')[1];
	if (!token) return next();

	const session = await findSessionByToken(token);
	if (!session) {
		ctx.throw(401, 'Wrong token');
	}
	await updateSession(session, new Date());
	ctx.user = await findUserById(session.user_id);
	return next();
});


// Display welcome message on the root
router.get('/', async (ctx) => {
	ctx.body = {
		message: 'kriffer.io REST API',
		version: 'v1'
	};
});


router.post('/login', login);
router.post('/register', register);
router.get('/me', mustBeAuthenticated, me);
router.get('/users', mustBeAuthenticated, getUsers);
router.get('/users/:id', mustBeAuthenticated, getUserById);
router.post('/users', mustBeAuthenticated, createUser);
router.put('/users/:id', mustBeAuthenticated, updateUser);
router.delete('/users/:id', mustBeAuthenticated, deleteUser);

router.get('/categories', getCategories)
router.get('/categories/post/:id', getCategoriesByPost)
router.post('/categories', mustBeAuthenticated,createCategory)
router.post('/categoriesposts', mustBeAuthenticated,createCategoriesPosts)
router.delete('/categoriesposts/post/:id', mustBeAuthenticated,deleteCategoriesPostsByPost)
router.delete('/categoriesposts/post/:postId/category/:categoryId', mustBeAuthenticated,deleteCategoriesPostsByPostByCategory)

router.get('/comments/post/:id', getCommentsByPost)
router.post('/comments', createComment)

router.get('/tags', getTags)
router.get('/tags/post/:id', getTagsByPost)
router.post('/tags',mustBeAuthenticated, createTag)
router.post('/tagsposts', mustBeAuthenticated,createTagsPosts)

router.delete('/tagsposts/post/:postId/tag/:tagId', mustBeAuthenticated,deleteTagsPosts)
router.delete('/tagsposts/post/:id', mustBeAuthenticated,deleteTagsPostsByPost)


router.get('/posts', getPosts)
router.get('/posts/category/:id', getPostsByCategory)
router.get('/posts/tag/:id', getPostsByTag)
router.get('/posts/:id', getPostById)
router.get('/posts/slug/:slug', getPostBySlug)
router.post('/posts', mustBeAuthenticated,createPost)
router.put('/posts/:id',mustBeAuthenticated, updatePost)
router.delete('/posts/:id',mustBeAuthenticated, deletePost)


app.use(router.routes());

app.use(router.allowedMethods());


// this for HTML5 history in browser
const fs = require('fs');


const index = fs.readFileSync(path.join(__dirname, '../../public/index.html'));
app.use(async (ctx) => {
	if (ctx.url.startsWith('/api/v1') || ctx.method !== 'GET') return;

	ctx.set('content-type', 'text/html');
	ctx.body = index;
});

// Start the server
const server = app.listen(port, (error) => {
	if (error) return console.log(`Error: ${error}`);

	console.log(`Server listening on port ${server.address().port}`);
});
