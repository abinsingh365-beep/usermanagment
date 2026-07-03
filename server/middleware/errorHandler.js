import { errorResponse } from "../utils/responsehandler.js";
const errorHandler = (err, req, res, next)=>{
    console.log("Error :", err.stack);
    const response = errorResponse({
        message : err.message ? err.message : "something went wrong",
    })

    res.status(response.statusCode).send(response);
}

export default errorHandler;