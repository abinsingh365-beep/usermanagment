import { successResponse, errorResponse } from "../utils/responsehandler.js";
import jwt from "jsonwebtoken";
import control_data from "../utils/control_data.json" with{type: "json"};
import User from "../db/model/user.js";


const accessControl = async function (access_types, req, res, next) {
    try {
        console.log("access control worked")
        if (access_types === "*") return next();
        const authHeader = req.headers.authorization;
        console.log("authHeader from access ctrl :", authHeader);

        if (!authHeader) {
            const response = errorResponse({
                message: "please login to continue"
            });
            return res.status(response.statusCode).send(response)

        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            const response = errorResponse({
                message: "token invailed"

            })
            return res.status(response.statusCode).send(response)
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded from access ctrl :", decoded);
        const user = await User.findById(decoded.user_id).populate("user_type");
        console.log("user from access ctrl :", user);

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
        console.log("usertype from access ctrl :", usertype);
        const allowed = access_types.split(",").map(id => control_data[id]);
        console.log("allowed from access ctrl :", allowed);

        if (allowed.includes(usertype.toLowerCase())) {
            console.log("user from access ctrl :", user);
            req.user = user;
            return next();
        }

        else {
            const response = errorResponse({
                message: "not allowed to access this route",
                statusCode: 403
            });
            return res.status(response.statusCode).send(response);

        }
    } catch (err) {
        console.log("err from access_ctrl:", err);

        const response = errorResponse({
            message: err.message || "something went wrong",
            statusCode: 500
        });

        return res.status(response.statusCode).send(response);
    }

};

export default accessControl;