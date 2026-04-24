// controllers/bfhlController.js

const { processData } = require("../services/bfhlService");

exports.handleBFHL = (req, res) => {
  if (!req.body || !Array.isArray(req.body.data)) {
    return res.status(400).json({
      error: "Request body must include a data array."
    });
  }

  const result = processData(req.body.data);
  res.json(result);
};
