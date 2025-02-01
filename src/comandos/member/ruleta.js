const fs = require("fs");
const path = require("path");
const { PREFIX } = require("../../krampus");

const commandStatusFilePath = path.resolve(process.cwd(), "assets/monedas.json");
const usageStatsFilePath = path.resolve(process.cwd(), "assets/usageStats.json");
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
  name: "ruleta",
  description: "Juega a la ruleta y gana o pierde monedas.",
  commands: ["ruleta"],
  usage: `${PREFIX}ruleta`,
  handle: async ({ sendReply, userJid }) => {
    const commandStatus = readData(commandStatusFilePath);
    if (commandStatus.commandStatus !== "on") {
      await sendReply("❌ El sistema de ruleta está desactivado.");
      return;
    }

    const usageStats = readData(usageStatsFilePath);
    const userStats = usageStats.users[userJid] || { attempts: 0 };
    if (userStats.attempts >= 3) {
      await sendReply("❌ Ya has alcanzado el límite de intentos diarios en la ruleta.");
      return;
    }

    userStats.attempts += 1;
    usageStats.users[userJid] = userStats;
    writeData(usageStatsFilePath, usageStats);

    await sendReply("🎲 Probando tu suerte...");
    await sendReply("🎲");

    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReply("💨");

    await new Promise(resolve => setTimeout(resolve, 2000));
    await sendReply("🎲");

    const result = Math.random();
    let amount = 0;
    if (result < 0.25) {
      amount = 1;
    } else if (result < 0.5) {
      amount = 2;
    } else if (result < 0.75) {
      amount = 3;
    } else if (result < 0.875) {
      amount = -2;
    } else {
      amount = -4;
    }

    let krData = readData(krFilePath);
    const userKr = krData.find(entry => entry.userJid === userJid);
    if (!userKr) {
      krData.push({ userJid, kr: 0 });
      writeData(krFilePath, krData);
      krData = readData(krFilePath);
      userKr = krData.find(entry => entry.userJid === userJid);
    }

    userKr.kr += amount;
    krData = krData.map(entry => entry.userJid === userJid ? userKr : entry);
    writeData(krFilePath, krData);

    if (amount > 0) {
      await sendReply(`🎉 ¡Has ganado ${amount} monedas! 🎉`);
    } else if (amount < 0) {
      await sendReply(`😢 ¡Has perdido ${Math.abs(amount)} monedas! 😢`);
    }
    await sendReply(`💰 Tu saldo actual es: ${userKr.kr} 𝙺𝚛`);
  },
};
