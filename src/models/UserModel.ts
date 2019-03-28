import { UserInterface } from '../interfaces/User'
import { Schema, Document, model, Model } from 'mongoose'

export interface UserModel extends UserInterface, Document {
}

interface UserModelInterface extends Model<UserModel> {
  upsertTwitterUser(token: string, tokenSecret: string, profile: { id: string }, callback?: (err: Error, result: number) => void): void
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: false,
    trim: true
  },
  facebookProvider: {
    type: {
      id: String,
      token: String
    },
    select: false
  },
  twitterProvider: {
    type: {
      id: String,
      token: String,
      tokenSecret: String
    },
    select: false
  }
}, { timestamps: true })

UserSchema.statics.upsertTwitterUser = function (token, tokenSecret, profile, cb) {
  var That = this
  return this.findOne({
    'twitterProvider.id': profile.id
  }, function (err, user) {
    // no user was found, lets create a new one
    if (!user) {
      var newUser = new That({
        email: profile.emails[0].value,
        twitterProvider: {
          id: profile.id,
          token: token,
          tokenSecret: tokenSecret
        }
      })

      newUser.save(function (error, savedUser) {
        if (error) {
          console.log(error)
        }
        return cb(error, savedUser)
      })
    } else {
      return cb(err, user)
    }
  })
}

export const User: UserModelInterface = model<UserModel, UserModelInterface>('User', UserSchema)
