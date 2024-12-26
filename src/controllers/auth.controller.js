import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hash,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token, {
      httpOnly: false,
      sameSite: "None",
      secure: true,
    });

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario existe
    const userFound = await User.findOne({ username });
    if (!userFound) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verificar que el campo password no sea undefined o nulo
    if (!userFound.password) {
      return res
        .status(500)
        .json({ message: "Contraseña no válida en el sistema" });
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // Respuesta en caso de éxito
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      message: "Login exitoso",
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: false,
    sameSite: "None",
    secure: true,
  });
  return res.sendStatus(200);
};
