import mongoose, {Schema} from 'mongoose';
import validator from 'validator';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

import Post from '../posts/post.model';
import { passwordReg } from './user.validation';
import constants from '../../config/constants';

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
        trim: true,
        validate: {
            validator(email){
                return validator.isEmail(email)
            },
            message: '{VALUE} is not a valid email',
        }
    },
    firstName: {
        type: String,
        required: [true, 'First Name is required.!'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last Name is required.!'],
        trim: true,
    },
    userName: {
        type: String,
        required: [true, 'Username is required.!'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required.!'],
        trim: true,
        minlength: [6, 'Password needs to be 6 character longer'],
        validate: {
            validator(password){
                return passwordReg.test(password);
            },
            message: '{Value} is not a valid password.!',
        }
    },
    favorites: {
      posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
      }]
    }
}, { timestamps: true } );

UserSchema.plugin(uniqueValidator, {
    message: '{VALUE} already taken.!',
})

UserSchema.pre('save', function(next) {
    if(this.isModified('password')){
        this.password = this._hashPassword(this.password);
    }
    return next();
});

UserSchema.methods = {
    _hashPassword(password){
        return hashSync(password);
    },

    authenticateUser(password){
        return compareSync(password, this.password);
    },
    createToken(){
        return jwt.sign(
            {
                _id: this._id,
            },
            constants.JWT_SECRET,
        )
    },
    toAuthJSON(){
        return{
            _id: this._id,
            userName: this.userName,
            token: `JWT ${this.createToken()}`,
        }
    },
    toJSON(){
        return{
            _id: this._id,
            userName: this.userName,
        };
    },

    _favorites: {
      async posts(postId){
        if(this.favorites.posts.indexOf(postId) >= 0){
          this.favorites.posts.remove(postId);
          await Post.decFavoriteCount(postId);
        }else{
          this.favorites.posts.push(postId);
          await Post.incFavoriteCount(postId);
        }
        return this.save();
      }
    }

}

export default mongoose.model('User', UserSchema);
