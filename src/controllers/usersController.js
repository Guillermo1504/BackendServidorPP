const { encrypt } = require("../bcrypt/handleBcrypt");
const bcrypt = require("bcryptjs");
const User = require("../models/userRegister.model");
const createAccessToken = require("../libs/jwt");
/**
 * Obtener una lista de la base de datos de todos los usuarios
 * @param {*} request
 * @param {*} response
 */
const getItems = async (request, response) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    response.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Obtener un solo usuario
 * @param {*} request
 * @param {*} response
 */
const getItem = async (request, response) => {
  try {
    const { body } = request;

    // Verifica si ya existe el usuario antes de traerlo
    const user = await User.findById(body._id);
    if (!user) {
      return response.status(404).json({ error: "Usuario no encontrado" });
    }

    response.json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      createdAt: user.createdAt,
      updatedA: user.updatedAt,
    });
  } catch (error) {
    response.status(500).json({ error: "Error interno del servidor" });
  }
};

/**
 * Registra un usuario
 * @param {*} request
 * @param {*} response
 */
const registerUser = async (request, response) => {
  const { fullName, email, password } = request.body;
  try {
    const userFound = await User.findOne({ email });
    if (userFound) return response.status(404).json(["El correo ya existe"]);

    const passwordHash = await encrypt(password);
    const registerUser = await User.create({
      fullName,
      email,
      password: passwordHash,
    });

    const token = await createAccessToken({ id: registerUser._id });

    response.cookie("token", token);
    response.json({
      id: registerUser._id,
      fullName: registerUser.fullName,
      email: registerUser.email,
      createdAt: registerUser.createdAt,
      updatedAt: registerUser.updatedAt,
    });
  } catch (error) {
    response.status(400).json({ error });
  }
};

/**
 * Logea un usuario
 * @param {*} request
 * @param {*} response
 */
const loginUser = async (request, response) => {
  const { email, password } = request.body;
  try {
    // verifica si el usuario existe
    const userFound = await User.findOne({ email });

    if (!userFound)
      return response.status(400).json({ message: "Usuario no encontrado" });

    const notFound = await bcrypt.compare(password, userFound.password);

    if (!notFound)
      return response.status(404).json({ message: "Contraseña incorrecta" });

    const token = await createAccessToken({ id: userFound._id });

    response.cookie("token", token);
    response.json({
      id: userFound._id,
      fullName: userFound.fullName,
      email: userFound.email,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    response.status(400).json({ error });
  }
};

/**
 * Logout usuario
 * @param {*} request
 * @param {*} response
 */

const logoutUser = (request, response) => {
  // Cuando van a hacer un logout el token va a estar vacio
  response.cookie("token", "", {
    // valor reseteado a 0, no va a haber token
    expires: new Date(0),
  });
  return response.sendStatus(200);
};

/**
 * Perfil usuario
 *
 */

const profile = async (request, response) => {
  const userFound = await User.findById(request.user.id);

  if (!userFound)
    return response.status(400).json({ message: "User not found" });

  return response.json({
    id: userFound._id,
    fullName: userFound.fullName,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};

/**
 * Editar un usuario
 * @param {*} request
 * @param {*} response
 */
const updateItem = async (request, response) => {
  try {
    const { body } = request;

    // Verifica si el usuario existe antes de editarlo
    const updatedUser = await User.updateOne(
      { _id: body._id },
      {
        $set: req.body,
      }
    );

    if (!updatedUser) {
      return response.status(404).json({ error: "Usuario no encontrado" });
    }

    response.json({
      data: updatedUser,
      message: "Usuario editado exitosamente",
    });
  } catch (error) {
    response.status(400).json({ error });
  }
};

/**
 * Eliminar un usuario
 * @param {*} request
 * @param {*} response
 */
const deleteItem = async (request, response) => {
  try {
    const { body } = request;

    // Verifica si el usuario existe antes de eliminarlo
    const userToDelete = await User.findOne({ _id: body._id });
    if (!userToDelete) {
      return response.status(404).json({ error: "Usuario no encontrado" });
    }

    // Elimina el usuario
    await User.deleteOne({ _id: body._id });

    response.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    response.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getItems,
  getItem,
  registerUser,
  loginUser,
  logoutUser,
  profile,
  updateItem,
  deleteItem,
};
