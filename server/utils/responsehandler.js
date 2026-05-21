export const successResponse = (api_data) => {

    return {
        status: true,
        statusCode: api_data.statusCode || 200,
        message: api_data.message || null,
        data: api_data.data || null
    };

};

export const errorResponse = (api_data) => {

    return {
        status: false,
        statusCode: api_data.statusCode || 400,
        message: api_data.message || null,
        data: api_data.data || null
    };

};