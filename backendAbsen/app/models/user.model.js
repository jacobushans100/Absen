const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name_user: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role_user: {
    type: Number,
    required: true,
  },
  last_access_user: {
    type: Date,
    default: null,
  },
});

userSchema.pre("save", function (next) {
  let user = this;
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(user.password, salt, (error, hash) => {
      user.password = hash;
      next();
    });
  });
});

userSchema.pre("findOneAndUpdate", function (next) {
  let user = this._update;
  let isModified = this.getUpdate().password;
  if (isModified) {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(user.password, salt, (error, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
