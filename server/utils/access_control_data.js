import { successResponse, errorResponse } from "../utils/responsehandler.js";
import jwt from "jsonwebtoken";
import control_data from "../utils/control_data.json" with{type: "json"};
import User from "../db/model/user.js";
import passwordTemplate from "../utils/passwordTemplate.js";
import sendMail from "../utils/sendMail.js";

const accessControl = async function (access_type, req, res, next) {
    try {
        if (access_type === "*") return next();
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            const response = errorResponse({
                message: "please login to continue"
            });
            return res.status(response.statusCode).send(response)
        }
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        const user = await User.findById(decoded.user_id).populate("user_type");

        if (!user) {
            const response = errorResponse({
                message: "user not found",
                statusCode: 404
            });
            return res.status(response.statusCode).send(response);
        }

        if (!user.user_type) {
            const response = errorResponse({
                message: "user type not defined",
                statusCode: 404
            });
            return res.status(response.statusCode).send(response);
        }

        const usertype = user.user_type.user_type;
        const allowed = access_types.split(",").map(id => control_data[id]);

        if (allowed.includes(userType)) {
            return next();
        }

        else {
            const response = errorResponse({
                message: "not allowed to access this route",
                statusCode: 403
            });
            return res.status(response.statusCode).send(respose);

        }
    }catch (err) {
        console.log("err from access_ctrl:", err.mesage);

        const response = errorResponse({
            message: err.message || "something went wrong",
            statusCode: 500
        });
         
        return res.status(response.statusCode).send(response);
    }

};

export default accessControl;