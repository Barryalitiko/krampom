const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const commandStatusFilePath = path.resolve(process.cwd(), "assets/monedas.json");

// Función para leer los datos del archivo JSON
const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return { commandStatus: "off" }; // Estado por defecto si el archivo no existe
  }
};

// Función para escribir los datos en el archivo JSON
const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

module.exports = {
  name: "toggle",
  description: "Activar o desactivar el sistema de comandos.",
  commands: ["monedas"],
  usage: `${PREFIX}toggle <on|off>`,
  handle: async ({ sendReply, args }) => {
    const action = args[0];

    if (!action || (action !== "on" && action !== "off")) {
      await sendReply("❌ Por favor, especifica si deseas activar o desactivar el sistema (`on` o `off`).");
      return;
    }

    // Leer el estado actual
    const currentStatus = readData(commandStatusFilePath);
    
    if (currentStatus.commandStatus === action) {
      await sendReply(`⚠️ El sistema ya está ${action === "on" ? "activado" : "desactivado"}.`);
      return;
    }

    // Cambiar el estado y escribirlo en el archivo JSON
    currentStatus.commandStatus = action;
    writeData(commandStatusFilePath, currentStatus);

    await sendReply(`✅ El sistema ha sido ${action === "on" ? "activado" : "desactivado"}.`);
  },
};