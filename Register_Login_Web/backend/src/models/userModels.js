import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
      select: false, 
      trim:true,
    },
    gender: {
      type: String,
      enum: ["female", "male", "other"],
      default: "other",
    },
    address: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);
export default User;
