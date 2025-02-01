const { PREFIX } = require("../../krampus");
const { downloadFacebookVideo } = require("../../services/ytdpl"); // Ruta correcta
const fs = require("fs");

module.exports = {
  name: "downloadfacebook",
  description: "Descargar un video de Facebook.",
  commands: ["facebook", "fb"],
  usage: `${PREFIX}downloadfacebook <URL del video de Facebook>`,
  handle: async ({ args, socket, remoteJid, sendReply, sendReact, webMessage }) => {
    try {
      const facebookUrl = args[0];
      if (!facebookUrl) {
        await sendReply("❌ Por favor, proporciona la URL del video de Facebook que deseas descargar.");
        return;
      }

      // Responder con un mensaje de "procesando..."
      await sendReply(`Buscando video en Facebook...\n> Krampus OM bot`);

      // Reaccionar con ⏳ al recibir el comando
      await sendReact("⏳", webMessage.key);

      // Descargar el video usando la función para Facebook
      const videoPath = await downloadFacebookVideo(facebookUrl);

      // Cambiar la reacción a 🎬 una vez que el video se descargó
      await sendReact("💙", webMessage.key);

      // Enviar el video descargado
      await socket.sendMessage(remoteJid, {
        video: { url: videoPath },
        caption: `> Krampus OM bot\n𝚅𝚒𝚍𝚎𝚘 𝚍𝚎 𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔 𝚌𝚊𝚛𝚐𝚊𝚍𝚘.`,
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
      console.error("Error al descargar el video de Facebook:", error);
      await sendReply("❌ Hubo un error al descargar el video de Facebook.");
    }
  },
};