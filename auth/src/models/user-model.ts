import mongoose from 'mongoose';
import { Password } from '../services/password';
// an interface that describes the properties
// that are required to create a new user
interface UserAttributes {
  email: string;
  password: string;
}
// an interface that describes the properties
// that a user model has
interface userModel extends mongoose.Model<userDocument> {
  build(attribute: UserAttributes): userDocument;
}

// an interface that describes the properties
// that a user document has
interface userDocument extends mongoose.Document<any> {
  email: string;
  password: string;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);
userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});
userSchema.statics.build = (attributes: UserAttributes) => {
  return new User(attributes);
};
const User = mongoose.model<userDocument, userModel>('User', userSchema);

export { User };
