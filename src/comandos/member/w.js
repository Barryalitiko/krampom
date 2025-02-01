const { PREFIX } = require("../../krampus");
const { downloadMusic } = require("../../services/ytdpl");
const ytSearch = require("yt-search");
const fs = require("fs");
const cooldowns = new Map();

module.exports = {
  name: "musica",
  description: "Descargar y enviar música desde YouTube",
  commands: ["musica", "m", "music", "play", "audio"],
  usage: `${PREFIX}musica <nombre del video>`,

  handle: async ({
    socket,
    remoteJid,
    sendReply,
    args,
    sendWaitReact,
    sendMusicReact,
    webMessage,
    sendMessage,
  }) => {
    try {
      const userId = remoteJid;
      const now = Date.now();
      const cooldownTime = 20 * 1000;

      if (cooldowns.has(userId)) {
        const lastUsed = cooldowns.get(userId);
        if (now - lastUsed < cooldownTime) {
          const remainingTime = Math.ceil((cooldownTime - (now - lastUsed)) / 1000);
          await sendReply(`❌ Estás en cooldown. Espera ${remainingTime} segundos para usar el comando nuevamente.`);
          return;
        }
      }

      cooldowns.set(userId, now);

      const videoQuery = args.join(" ");
      if (!videoQuery) {
        await sendReply("❌ Por favor, proporciona el nombre del video que deseas buscar.");
        return;
      }

      await sendWaitReact("⏳");

      const searchResult = await ytSearch(videoQuery);
      const video = searchResult.videos[0];
      if (!video) {
        await sendReply("❌ No se encontró ningún video con ese nombre.", { quoted: webMessage });
        return;
      }

      const videoUrl = video.url;
      const videoTitle = video.title;
      const videoDuration = video.timestamp.split(":").slice(-2).join(":");

      console.log(`Video encontrado: ${videoTitle}, URL: ${videoUrl}`);

      const message = `1:10━━━━●───── ${videoDuration} \n\n${videoTitle} \n\n> Bot by Krampus OM Oᴘᴇʀᴀᴄɪᴏɴ Mᴀʀsʜᴀʟʟ ༴༎𝙾𝙼༎`;
      await sendReply(message, { quoted: webMessage });

      const musicPath = await downloadMusic(videoUrl);
      console.log(`Música descargada correctamente: ${musicPath}`);

      await sendMusicReact("🎵");

      await sendMessage({
        messageType: "audio",
        url: musicPath,
        mimetype: "audio/mp4",
        caption: `🎶 Aquí tienes la música: ${videoTitle}`,
      });

      setTimeout(() => {
        fs.unlink(musicPath, (err) => {
          if (err) {
            console.error(`Error al eliminar el archivo de música: ${err}`);
          } else {
            console.log(`Archivo de música eliminado: ${musicPath}`);
          }
        });
      }, 1 * 60 * 1000);
    } catch (error) {
      console.error("Error al descargar o enviar la música:", error);
      await sendReply("❌ Hubo un error al procesar la música.", { quoted: webMessage });
    }
  },
};
