const jwt = require('jsonwebtoken');
function auth(req, res, next) {
  const { accessToken } = req.body;
  if (!accessToken)
    return res.status(401).send('Access denied. No token provided.');
  try {
    const decoded = jwt.verify(
      accessToken,
      '7532c4e5f3edc44bc8735e514b026400a71c80a13fcd0e07203adb4b7'
    );
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).send('Invaild token');
  }
}
module.exports = auth;
