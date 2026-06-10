import users from "../db/model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/responseHandler.js";



export const signin = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await users.findOne({ email })
            .select("+password").populate("user_type");


        console.log("userr :", user);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        const userType = user.user_type.user_type;

        console.log("usertype :", userType);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                user_id: user._id,

            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: { token, userType }
            ,
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const updatePassword = async (req, res) => {

    try {
        const { id } = req.params;
        const { password } = req.body;

        const updatePassword = await User.findByIdAndUpdate(
            id,
            { password }

        );
        if (!updatePassword)
            let response = errorResponse({

                status: false,
                statusCode: api_data.statusCode || 400,
                message: "faild to update password"


            });
            return res.status(response.statusCode).send(response)


            let response = successResponse({
                status: true,
                statusCode: api.data.statusCode || 200,
                message: "reset password successfully"
            });
            return res.status(response.statusCode).send(response);
    }

    catch (err){
        console.log("something went wrong",err.message || err);

        const response = errorResponse({
            status: false,
            message: "something went wrong",
            statusCode: 400
        })
        return res.status(response.statusCode).send(response)
    }
        
    }

