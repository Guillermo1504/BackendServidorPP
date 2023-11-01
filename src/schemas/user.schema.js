const z = require("zod");

const registerSchema = z.object({
  fullName: z
    .string({
      required_error: "El nombre completo es requerido",
    })
    .regex(/^[A-Za-z\s]+$/, {
      message: "El nombre completo solo debe contener letras",
    }),
  email: z
    .string({
      required_error: "El correo es requerido",
    })
    .email({
      message: "correo inválido",
    }),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "El correo es requerido",
    })
    .email({
      message: "correo inválido",
    }),
  password: z
    .string({ required_error: "La contraseña es requerida" })
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

module.exports = { registerSchema, loginSchema };
