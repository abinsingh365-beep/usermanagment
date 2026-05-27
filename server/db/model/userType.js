import mongoose from "mongoose";

const userType =  mongoose.Schema(
    {
       user_type: {
            type: mongoose.Schema.Types.ObjectId,
            // ref: "user_types"
            required: true

        },
    },
    {
        timestamps: true
    });

const User =
    
    mongoose.model("user_types", userType);

export default User;