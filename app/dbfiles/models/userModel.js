import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: [true,"Provide Username"] },
  password: { type: String, required: [true,"Provide Password"]},
  email: { type: String, unique: true, required: [true,"Provide Email"] },
  createdAt: { type: Date, default: Date.now }
});

try{
var User = mongoose.model('User', userSchema);
module.exports = User;
}
catch(error){
	console.log(error)
}
