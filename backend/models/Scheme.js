import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    benefits: {
      type: String,
      required: true,
    },

    occupation: {
      type: String,
      required: true,
    },

    maxIncome: {
      type: Number,
      required: true,
    },

    minAge: {
      type: Number,
      required: true,
    },

    maxAge: {
      type: Number,
      required: true,
    },

    documents: {
      type: String,
      required: true,
    },

    link: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Scheme", schemeSchema);