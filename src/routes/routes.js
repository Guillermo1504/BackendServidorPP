const express = require("express");
const router = express.Router();
const {
  getItems,
  registerUser,
  loginUser,
  logoutUser,
  profile,
  deleteItem,
  getItem,
  updateItem,
} = require("../controllers/usersController");
const authRequired = require("../middlewares/validateToken.js");
const validateSchema = require("../middlewares/validator.middleware");
const { registerSchema, loginSchema } = require("../schemas/user.schema.js");

router.get("/user/getUsers", getItems);

router.get("/user/oneOption", getItem);

router.get("/user/profile", authRequired, profile);

router.post("/user/register", validateSchema(registerSchema), registerUser);

router.post("/user/login", validateSchema(loginSchema), loginUser);

router.post("/user/logout", logoutUser);

router.put("/user/update", updateItem);

router.delete("/user/delete", deleteItem);

module.exports = router;
