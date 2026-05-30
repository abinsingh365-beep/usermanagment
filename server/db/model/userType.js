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

export default mongoose.models.UserType || mongoose.model("UserType", userTypeSchema, "user_types");
<<<<<<< HEAD

=======
>>>>>>> 44412a7 (usm page updated)
