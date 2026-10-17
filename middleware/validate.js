const validate = (schema) => async (res, req, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(500).json({
      error: "Validation failed",
      details: error.error,
    });
  }
};

module.exports = validate;
