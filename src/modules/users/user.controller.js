import HTTPStatus from 'http-status';

import User from './user.model';

export async function signUp(req, res) {
    try{
        console.log(req.body);
        const user = await User.create(req.body);
        // STATUS CODE 201 SUCCESSFULL USER CREATION
        return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
    }catch(err){
        return res.status(HTTPStatus.BAD_REQUEST).json(err);
    }
}

export function login(req, res, next){
    res.status(HTTPStatus.OK).json(req.user.toAuthJSON());

    return next();
}