const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByMajorId
} = require("../service/serviceUser");

const fetchAllUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({
      response: {
        status: "success",
        message: "Users fetched successfully",
      },
      data: users,
    });
  } catch (err) {
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

const fetchUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "User not found",
        },
        data: null,
      });
    }
    res.status(200).json({
      response: {
        status: "success",
        message: "User fetched successfully",
      },
      data: user,
    });
  } catch (err) {
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

const modifyUser = async (req, res) => {
  const { id } = req.params;
  const { email, username, major_id, is_admin } = req.body;

  try {
    const updatedUser = await updateUser(id, { email, username, major_id, is_admin });
    if (!updatedUser) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "User not found",
        },
        data: null,
      });
    }
    res.status(200).json({
      response: {
        status: "success",
        message: "User updated successfully",
      },
      data: updatedUser,
    });
  } catch (err) {
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

const removeUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({
        response: {
          status: "error",
          message: "User not found",
        },
        data: null,
      });
    }
    res.status(200).json({
      response: {
        status: "success",
        message: "User deleted successfully",
      },
      data: deletedUser,
    });
  } catch (err) {
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

const getUsersByMajorIdController = async (req, res) => {
  try {
    const { major_id } = req.params; 
    if (!major_id) {
      return res.status(400).json({
        status: "error",
        message: "major_id is required",
      });
    }

    const users = await getUsersByMajorId(major_id);

    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    console.error("Error in getUsersByMajorIdController:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  fetchAllUsers,
  fetchUserById,
  modifyUser,
  removeUser,
  getUsersByMajorIdController
};