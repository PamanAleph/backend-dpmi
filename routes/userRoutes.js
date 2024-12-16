const router = require("express").Router();
const {
  fetchAllUsers,
  fetchUserById,
  modifyUser,
  removeUser,
  getUsersByMajorIdController,
} = require("../controller/controllerUser");

router.get("/", fetchAllUsers);
router.get("/id/:id", fetchUserById);
router.put("/:id", modifyUser);
router.delete("/:id", removeUser);
router.get("/major/:major_id", getUsersByMajorIdController);

module.exports = router;
