import express from 'express'
import PostCtrl from '../Controllers/PostCtrl.js'
import Auth from '../Middleware/Auth.js'

const router = express.Router()

router.route('/posts')
    .post(Auth, PostCtrl.createPost)
    .get(Auth, PostCtrl.getPosts)

router.route('/post/:id')
    .patch(Auth, PostCtrl.updatePost)
    .get(Auth, PostCtrl.getPost)
    .delete(Auth, PostCtrl.deletePost)

router.patch('/post/:id/like', Auth, PostCtrl.likePost)

router.patch('/post/:id/unlike', Auth, PostCtrl.unLikePost)

router.get('/user_posts/:id', Auth, PostCtrl.getUserPosts)

router.get('/post_discover', Auth, PostCtrl.getPostsDiscover)

router.patch('/savePost/:id', Auth, PostCtrl.savePost)

router.patch('/unSavePost/:id', Auth, PostCtrl.unSavePost)

router.get('/getSavePosts', Auth, PostCtrl.getSavePosts)


export default router