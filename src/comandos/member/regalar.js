const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const krFilePath = path.resolve(process.cwd(), "assets/kr.json");

const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error al escribir en el archivo ${filePath}: ${error.message}`);
  }
};

module.exports = {
  name: "gift",
  description: "Regala monedas a otro usuario.",
  commands: ["gift"],
  usage: `${PREFIX}gift <cantidad> <usuario>`,
  handle: async ({ sendReply, args, userJid }) => {
    if (args.length < 2) {
      await sendReply(`❌ Error: debes proporcionar la cantidad y el usuario al que deseas regalar.`);
      return;
    }

    const cantidad = parseInt(args[0]);
    const usuario = args.slice(1).join(" ");

    if (isNaN(cantidad) || cantidad <= 0) {
      await sendReply(`❌ Error: la cantidad debe ser un número entero positivo.`);
      return;
    }

    const krData = readData(krFilePath);
    const userKr = krData.find(entry => entry.userJid === userJid);

    if (!userKr || userKr.kr < cantidad) {
      await sendReply(`❌ Error: no tienes suficientes monedas para regalar.`);
      return;
    }

    const usuarioKr = krData.find(entry => entry.userJid === usuario);
    if (!usuarioKr) {
      krData.push({ userJid: usuario, kr: cantidad });
    } else {
      usuarioKr.kr += cantidad;
    }

    userKr.kr -= cantidad;
    writeData(krFilePath, krData);

    await sendReply(`✅ Has regalado ${cantidad} monedas a ${usuario}.`);
  },
};
