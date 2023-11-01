const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("CONEXION EXITOSA A MONGO DB😎😎😎");
  } catch (error) {
    console.error("ERROR DE CONEXION 😒😒😒:", error);
  }
};

module.exports = dbConnect;
