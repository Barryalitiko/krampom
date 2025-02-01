const { PREFIX } = require("../../krampus");
const fs = require("fs");
const path = require("path");

const statusFilePath = path.resolve(process.cwd(), "assets/status.json");

const readStatus = () => {
  try {
    const data = fs.readFileSync(statusFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { enabled: false }; // Si no existe el archivo, devolvemos deshabilitado
  }
};

module.exports = {
  name: "kiss",
  description: "Enviar un beso a alguien. Debes etiquetar o responder a un usuario.",
  commands: ["tijera"],
  usage: `${PREFIX}kiss @usuario o responde a un mensaje`,
  handle: async ({ socket, remoteJid, sendReply, sendReact, args, isReply, replyJid, userJid }) => {
    try {
      const currentStatus = readStatus();
      if (!currentStatus.enabled) {
        await sendReply("❌ El sistema de comandos está apagado. Por favor, enciéndelo para usar este comando.");
        return;
      }

      let targetJid;

      // Si el comando es una respuesta a un mensaje, obtenemos el JID del destinatario
      if (isReply) {
        targetJid = replyJid;
      }
      // Si el comando incluye una etiqueta, obtenemos el JID de la etiqueta
      else if (args && args.length > 0) {
        targetJid = args[0].replace("@", "") + "@s.whatsapp.net";
      }

      // Si no hay destinatario, enviamos un mensaje de error
      if (!targetJid) {
        await sendReply("❌ Debes etiquetar o responder a un usuario para enviarle un beso.");
        return;
      }

      // Enviar el beso
      await sendReact("✂", remoteJid);
      await socket.sendMessage(remoteJid, {
        video: fs.readFileSync("assets/sx/tijera.mp4"),
        caption: `> 𝑫𝑰𝑨 𝑫𝑬 𝑪𝑶𝑳𝑶𝑹𝑬𝑺?\n@${userJid.split("@")[0]} 𝒚 @${targetJid.split("@")[0]}\n𝒆𝒔𝒕𝒂𝒏 𝒉𝒂𝒄𝒊𝒆𝒏𝒅𝒐 𝒕𝒊𝒋𝒆𝒓𝒂𝒔 😋.`,
        gifPlayback: true,
        mentions: [userJid, targetJid]
      });
    } catch (error) {
      console.error("Error en el comando kiss:", error);
      await sendReply("❌ Ocurrió un error al procesar el comando.");
    }
  }
};
