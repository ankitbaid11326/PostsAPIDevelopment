import HTTPStatus from 'http-status';

import Post from './post.model';
import User from '../users/user.model';

export async function createPost(req, res) {
    try {
        const post = await Post.createPost(req.body, req.user._id);
        return res.status(HTTPStatus.CREATED).json(post);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function getPostById(req, res) {
    try{
        const post = await Post.findById(req.params.id).populate('user');
        return res.status(HTTPStatus.OK).json(post);
    }catch (err){
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function getPostsList(req, res){
    try{
        const limit = parseInt(req.query.limit, 0);
        const skip = parseInt(req.query.skip, 0);
        const posts = await Post.list({ limit: limit, skip: skip });
        return res.status(HTTPStatus.OK).json(posts);
    }catch(err){
        return res.status(HTTPStatus.BAD_REQUEST).json(err);
    }
}
export async function updatePost(req, res){
  try {
    const post = await Post.findById(req.params.id);
    if(!post.user.equals(req.user._id)){
       return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }

    Object.keys(req.body).forEach(key => {
      post[key] = req.body[key];
    });

    return res.status(HTTPStatus.OK).json(await post.save());

  } catch (e) {
      return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function deletePost(req, res){
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if(!post.user.equals(req.user._id)){
      return res.sendStatus(HTTPStatus.UNAUTHORIZED);
    }
    await post.remove();
    return res.sendStatus(HTTPStatus.OK);


  } catch (e) {
      return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}

export async function favoritePost(req, res){
  try {
    const user = await User.findById(req.user._id);
    await user._favorites.posts(req.params.id);
    return res.sendStatus(HTTPStatus.OK);
  } catch (e) {
      return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
}