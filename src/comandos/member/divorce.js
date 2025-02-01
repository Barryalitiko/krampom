const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const marriageFilePath = path.resolve(process.cwd(), "assets/marriage.json");
const inventoryFilePath = path.resolve(process.cwd(), "assets/inventory.json");

// Funciones para leer y escribir los datos JSON
const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

module.exports = {
  name: "divorce",
  description: "Divorciarte de tu pareja actual con un papel de divorcio.",
  commands: ["divorce"],
  usage: `${PREFIX}divorce`,
  handle: async ({ sendReply, userJid }) => {
    const marriageData = readData(marriageFilePath);
    const inventoryData = readData(inventoryFilePath);

    // Verificar si el usuario está casado
    const marriageIndex = marriageData.findIndex(
      (entry) => entry.userJid === userJid || entry.partnerJid === userJid
    );

    if (marriageIndex === -1) {
      await sendReply("❌ No estás casado actualmente.");
      return;
    }

    // Verificar si el usuario tiene un papel de divorcio
    const userInventory = inventoryData.find((entry) => entry.userJid === userJid);
    if (!userInventory || userInventory.divorcePapers < 1) {
      await sendReply("❌ No tienes un papel de divorcio. Compra uno para poder divorciarte.");
      return;
    }

    // Reducir el número de papeles de divorcio en el inventario
    userInventory.divorcePapers -= 1;
    writeData(inventoryFilePath, inventoryData);

    // Procesar divorcio
    const { userJid: partner1, partnerJid: partner2 } = marriageData[marriageIndex];
    marriageData.splice(marriageIndex, 1); // Eliminar matrimonio
    writeData(marriageFilePath, marriageData);

    await sendReply(`📄 @${partner1.split("@")[0]} y @${partner2.split("@")[0]} ahora están divorciados.`);
  },
};