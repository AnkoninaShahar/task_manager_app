const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      error: "Validation failed",
      details: error.errors,
    });
  }
};

module.exports = validate;
