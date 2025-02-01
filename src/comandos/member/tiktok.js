const { PREFIX } = require("../../krampus");
const { downloadTikTok } = require("../../services/ytdpl"); // Asegúrate de que esta ruta sea correcta
const fs = require("fs");

const cooldowns = new Map(); // Mapa para almacenar el tiempo del último uso por usuario

module.exports = {
  name: "downloadtiktok",
  description: "Descargar un video de TikTok.",
  commands: ["tiktok", "tt"],
  usage: `${PREFIX}downloadtiktok <URL del video de TikTok>`,
  handle: async ({ args, socket, remoteJid, sendReply, sendReact, webMessage }) => {
    try {
      const userId = remoteJid; // Usamos remoteJid para identificar al usuario
      const now = Date.now();
      const cooldownTime = 20 * 1000; // 20 segundos de cooldown

      // Verificamos si el usuario está en cooldown
      if (cooldowns.has(userId)) {
        const lastUsed = cooldowns.get(userId);
        if (now - lastUsed < cooldownTime) {
          const remainingTime = Math.ceil((cooldownTime - (now - lastUsed)) / 1000);
          await sendReply(`❌ Estás en cooldown. Espera ${remainingTime} segundos para usar el comando nuevamente.`);
          return;
        }
      }

      // Actualizamos el tiempo de la última ejecución
      cooldowns.set(userId, now);

      const tiktokUrl = args[0];
      if (!tiktokUrl) {
        await sendReply("❌ Por favor, proporciona la URL del video de TikTok que deseas descargar.");
        return;
      }

      // Responder con un mensaje de "procesando..."
      await sendReply(`𝙸𝚗𝚒𝚌𝚒𝚊𝚗𝚍𝚘 𝚍𝚎𝚜𝚌𝚊𝚛𝚐𝚊...\n> Krampus OM bot`);

      // Reaccionar con ⏳ al recibir el comando
      await sendReact("⏳", webMessage.key);

      // Descargar el video usando la función para TikTok
      const videoPath = await downloadTikTok(tiktokUrl);

      // Cambiar la reacción a 🎬 una vez que el video se descargó
      await sendReact("🖤", webMessage.key);

      // Enviar el video descargado
      await socket.sendMessage(remoteJid, {
        video: { url: videoPath },
        caption: `> Krampus OM bot\n𝚅𝚒𝚍𝚎𝚘 𝚍𝚎 𝙏𝙄𝙆𝙏𝙊𝙆 𝚌𝚊𝚛𝚐𝚊𝚍𝚘.`,
        quoted: webMessage, // Responde al mensaje original del usuario
        ptt: false, // Enviar como video normal, no como nota
      });

      // Eliminar el archivo después de enviarlo
      setTimeout(() => {
        fs.unlink(videoPath, (err) => {
          if (err) {
            console.error(`Error al eliminar el archivo de video: ${err}`);
          } else {
            console.log(`Archivo de video eliminado: ${videoPath}`);
          }
        });
      }, 1 * 60 * 1000); // Eliminar después de 1 minuto

    } catch (error) {
      console.error("Error al descargar el video de TikTok:", error);
      await sendReply("❌ Hubo un error al descargar el video de TikTok.");
    }
  },
};