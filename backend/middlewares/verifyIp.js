const ALLOWED_IPS = ["203.92.41.123", "203.92.41.95"];

module.exports = function (allowedIps) {
  return function (req, res, next) {
    const requestIp =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.connection.remoteAddress;

    console.log("Callback Request IP:", requestIp);

    if (!allowedIps.includes(requestIp)) {
      return res.status(403).send("Forbidden – Untrusted IP");
    }

    next();
  };
};
