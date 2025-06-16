import config from './index';
import cors from 'cors';

let corsOptions: cors.CorsOptions = {};

if (config.node_env === 'production') {
    corsOptions = {
        origin: (origin, callback) => {
            // Cho phép các request không có origin (ví dụ: Postman, mobile apps)
            if (!origin) return callback(null, true);

            if (config.allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    };
}

export { corsOptions };