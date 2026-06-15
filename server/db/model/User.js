import mongoose from "mongoose";
import "./userType.js";
const userSchema = new mongoose.Schema(
  {
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

    user_type: {
      type: mongoose.Types.ObjectId,
      ref: "UserType"
    },

    is_password_reset:{
      type:Boolean,
      default:false
      
    },

    password_token: {
      type : String,
      required : true
    }
    


  },
  {
    timestamps: true
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;