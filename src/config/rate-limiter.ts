import rateLimit from 'express-rate-limit';

// Limiter chung cho tất cả các API
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP chỉ được 100 requests trong 15 phút
  standardHeaders: true, // Trả về thông tin rate limit trong header `RateLimit-*`
  legacyHeaders: false, // Tắt các header cũ `X-RateLimit-*`
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
});

// Limiter nghiêm ngặt hơn cho các API nhạy cảm (đăng ký, đăng nhập)
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 5, // Giới hạn mỗi IP chỉ được 5 requests login/register trong 1 giờ
  message: { message: 'Too many login/register attempts from this IP, please try again after an hour.' },
});