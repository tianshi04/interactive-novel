import config from './index';
import cors from 'cors';

const isProd = config.node_env === 'production';
const allowedOrigins = config.allowedOrigins || [];

const checkOrigin: cors.CorsOptions['origin'] = (origin, callback) => {
    // Cho phép các request không có origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    if (!allowedOrigins.includes(origin)) {
        const msg = 'CORS policy does not allow access from this origin: ' + origin;
        return callback(new Error(msg), false);
    }

    return callback(null, true);
};

const corsOptions: cors.CorsOptions = {
    origin: isProd ? checkOrigin : allowedOrigins,
    credentials: true,
};

export { corsOptions };