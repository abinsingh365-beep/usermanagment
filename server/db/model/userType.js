import mongoose from "mongoose";

const userTypeSchema = new mongoose.Schema(
  {
    user_type: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserType =
  mongoose.models.UserType ||
  mongoose.model("UserType", userTypeSchema);

export default UserType;