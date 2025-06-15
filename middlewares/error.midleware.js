// create a subscription -> middleware  (check for renewal) -> middleware (check for errors) -> controller

const errorMiddleWare = (err, req, res, next) => {
    try {
        let error = { ...err };

        error.message = err.message;
        console.error(err);

        //mongoose bad object id error
        if (err.name === 'CastError') {
            const message = 'resource not found';
            error = new Error(message);
            error.statuscode = 404;
        }

        // let error = {...err};
        // error.message = err.message;
        // console.error(err);

        // if (err.name === 'CastError') {
        //   const message = 'resource not found';
        //   error = new Error(message);
        //   error.statuscode = 404;
        //}

        // mongoose duplicate key error
        if (err.code === 11000) {
            const  message = 'Duplicate field value entered';
            error = new Error(message);
            error.statuscode = 400;
        }

        //mongoose validation error 
        if (err.name === 'validationError') {
            const message = Object.values(err.errors).map(val => val.message);
            error = new Error(message.join(', '));
            error.statuscode = 400;
        }

        res.status(error.statuscode || 500).json({
            success: false,
            error: error.message || 'Server Error'
        });
    } catch (error) {
        next(error);
    }
}
export default errorMiddleWare;
