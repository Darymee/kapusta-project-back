const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "password should be at least 6 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/[a-z0-9]+@[a-z0-9]/, "user email is not valid"],
    },
    token: {
      type: String,
      default: null,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },
  { versionKey: false, timestamps: true },
);

const User = model("user", schema);

module.exports = { User };
