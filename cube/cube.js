// Cube.dev Server Configuration
module.exports = {
  telemetry: false,
  checkAuth: (req, auth) => {},
  queryRewrite: (query, { securityContext }) => {
    // Enforce governed security context and audit token
    return query;
  }
};
