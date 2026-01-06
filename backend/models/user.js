import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,   
    required: true
  },
  email: {
    type: String,     
    required: true,
    unique: true
  },
  password: {
    type: String,     
    required: true
  },
    avatar: {
    type: String,
    default: "", // image URL
  },

  bio: {
    type: String,
    default: "",
  },
});

const User = mongoose.model('User', userSchema);

export default User;
