const {
  findAll,
  findById,
  createData,
  updateData,
  deleteData,
  findBySlug,
} = require("../service/serviceMajor");

const getAllData = async (req, res) => {
  try {
    const data = await findAll();

    // Transform emails to array
    const transformedData = data.map((row) => ({
      ...row,
      emails: row.emails
        ? row.emails.split(",").map((email) => email.trim()) // Split by comma and trim whitespace
        : [], // Use empty array if emails is null
    }));

    res.json({
      response: {
        status: "success",
        message: "Data fetched successfully",
      },
      data: transformedData,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const getDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await findById(id);

    if (!data) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "Data not found",
        },
        data: null,
      });
    }

    const transformedData = {
      ...data,
      emails: data.emails
        ? data.emails.split(",").map((email) => email.trim()) 
        : [], 
    };

    res.json({
      response: {
        status: "success",
        message: "Data fetched successfully",
      },
      data: transformedData,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const createNewData = async (req, res) => {
  try {
    const data = await createData(req.body);
    res.status(201).json({
      response: {
        status: "success",
        message: "Data created successfully",
      },
      data: data,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const updateExistingData = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await updateData(id, req.body);
    res.json({
      response: {
        status: "success",
        message: "Data updated successfully",
      },
      data: data,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const deleteExistingData = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteData(id);
    res.json({
      response: {
        status: "success",
        message: "Data deleted successfully",
      },
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

const getMajorBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const data = await findBySlug(slug);
    if (!data) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "Data not found",
        },
        data: null,
      });
    }
    res.json({
      response: {
        status: "success",
        message: "Data fetched successfully",
      },
      data: data,
    });
  } catch (err) {
    console.error("Internal server error:", err);
    res.status(500).json({
      response: {
        status: "error",
        message: "Internal server error",
        details: err.message,
      },
      data: null,
    });
  }
};

module.exports = {
  getAllData,
  getDataById,
  createNewData,
  updateExistingData,
  deleteExistingData,
  getMajorBySlug,
};
