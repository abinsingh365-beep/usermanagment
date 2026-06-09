import mongoose from "mongoose";

const userTypeSchema = new mongoose.Schema(
  {
    user_type: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("UserType", userTypeSchema);

