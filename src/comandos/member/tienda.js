const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const commandStatusFilePath = path.resolve(process.cwd(), "assets/monedas.json");
const krFilePath = path.resolve(process.cwd(), "assets/kr.json");
const userItemsFilePath = path.resolve(process.cwd(), "assets/userItems.json");

const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    return {};
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

module.exports = {
  name: "tienda",
  description: "Compra objetos en la tienda con tus monedas.",
  commands: ["tienda"],
  usage: `${PREFIX}tienda <objeto>`,
  handle: async ({ sendReply, args, userJid }) => {
    const commandStatus = readData(commandStatusFilePath);
    if (commandStatus.commandStatus !== "on") {
      await sendReply("❌ El sistema de tienda está desactivado.");
      return;
    }

    const precios = {
      "💍": 6,
      "📜": 7,
    };

    const objeto = args[0]?.toLowerCase();
    if (!objeto) {
      let listaPrecios = "🛒 *Lista de precios de la tienda*:\n";
      for (const [item, precio] of Object.entries(precios)) {
        listaPrecios += `- ${item}: ${precio} monedas\n`;
      }
      listaPrecios += `\nUsa *${PREFIX}tienda <objeto>* para comprar.`;
      await sendReply(listaPrecios);
      return;
    }

    if (!precios[objeto]) {
      await sendReply("❌ Objeto inválido. Usa el comando sin argumentos para ver la lista de precios.");
      return;
    }

    let krData = readData(krFilePath);
    if (!krData.find(entry => entry.userJid === userJid)) {
      krData.push({ userJid, kr: 0 });
    }
    const userKr = krData.find(entry => entry.userJid === userJid).kr;

    if (userKr < precios[objeto]) {
      await sendReply(`❌ No tienes suficientes monedas. Necesitas ${precios[objeto]} monedas para comprar ${objeto}.`);
      return;
    }

    let userItems = readData(userItemsFilePath);
    if (typeof userItems !== 'object' || !Array.isArray(userItems)) {
      userItems = [];
    }
    if (!userItems.find(entry => entry.userJid === userJid)) {
      userItems.push({ userJid, items: { anillos: 0, papeles: 0 } });
    }
    const userItem = userItems.find(entry => entry.userJid === userJid);

    if (objeto === "💍") {
      userItem.items.anillos += 1;
    } else if (objeto === "📜") {
      userItem.items.papeles += 1;
    }

    const userKrBalance = userKr - precios[objeto];
    krData = krData.map(entry => entry.userJid === userJid ? { userJid, kr: userKrBalance } : entry);
    userItems = userItems.map(entry => entry.userJid === userJid ? userItem : entry);

    writeData(userItemsFilePath, userItems);
    writeData(krFilePath, krData);

    await sendReply(`✅ ¡Has comprado ${objeto}! Ahora tienes ${userKrBalance} monedas y:\n- 💍: ${userItem.items.anillos}\n- 📜: ${userItem.items.papeles}`);
  },
};
