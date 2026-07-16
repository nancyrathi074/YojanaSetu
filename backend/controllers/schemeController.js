import Scheme from "../models/Scheme.js";

// Get all schemes
export const getSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find();

    res.status(200).json({
      success: true,
      count: schemes.length,
      schemes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add a new scheme
export const createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);

    res.status(201).json({
      success: true,
      message: "Scheme Added Successfully",
      scheme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};