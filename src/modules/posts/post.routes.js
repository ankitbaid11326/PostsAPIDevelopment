import { Router } from 'express';
import validate from 'express-validation';

import * as postController from './post.controller';
import { authJwt } from '../../services/auth.services';
import postValidation from './post.validation';

const routes = new Router();

routes.post('/', authJwt, validate(postValidation.createPost), postController.createPost);

routes.get('/:id', postController.getPostById);
routes.get('/', postController.getPostsList);
routes.patch('/:id', authJwt, validate(postValidation.updatePost), postController.updatePost);
routes.delete('/:id', authJwt, postController.deletePost);

// favorites routes
routes.post('/:id/favorite', authJwt, postController.favoritePost);

export default routes;
