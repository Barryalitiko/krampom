const { PREFIX } = require("../../krampus");

// Objeto para rastrear el tiempo de uso del comando por grupo
const cooldowns = {};

module.exports = {
  name: "hide-tag",
  description: "Para mencionar a todos",
  commands: ["krampus-bot", "todos"],
  usage: `${PREFIX}hidetag motivo`,
  handle: async ({ fullArgs, sendText, socket, remoteJid, sendReact }) => {
    const cooldownTime = 120 * 1000; // 120 segundos
    const now = Date.now();

    // Verificar si el comando está en tiempo de espera
    if (cooldowns[remoteJid] && now - cooldowns[remoteJid] < cooldownTime) {
      const remainingTime = Math.ceil((cooldownTime - (now - cooldowns[remoteJid])) / 1000);
      await sendText(`⏳ Este comando solo puede usarse cada 2 minutos. Por favor, espera ${remainingTime} segundos.`);
      return;
    }

    try {
      // Obtener participantes del grupo
      const { participants } = await socket.groupMetadata(remoteJid);

      // Crear lista de menciones
      const mentions = participants.map(({ id }) => id);

      // Enviar reacción
      await sendReact("👻");

      // Enviar mensaje etiquetando a todos
      await sendText(
        `👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻\nHe llamado a todos!\n\n${fullArgs}`,
        mentions
      );

      // Registrar el tiempo de uso del comando
      cooldowns[remoteJid] = now;
    } catch (error) {
      console.error("Error al ejecutar el comando hide-tag:", error);
      await sendText("❌ Ocurrió un error al intentar mencionar a todos.");
    }
  },
};