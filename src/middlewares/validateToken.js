const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config/token");

const authRequired = (request, response, next) => {
  const { token } = request.cookies;

  if (!token)
    return response
      .status(401)
      .json({ message: "No hay token, autorizacion denegada" });

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err) return response.status(403).json({ message: "Token invalido" });

    request.user = user;
    next();
  });
};
module.exports = authRequired;
