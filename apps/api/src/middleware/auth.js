
import jwt from 'jsonwebtoken';
//req -> middleware1 -> middleware2  .... ->  res 

export function authMiddleware(req, res, next) {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');
  
    if (type !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
  
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const sub = payload.sub;
      if (!sub) {
        return res.status(401).json({ error: 'Invalid token payload' });
      }
      req.userId = sub;
      return next();
    } catch {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }