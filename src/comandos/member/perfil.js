const { PREFIX } = require("../../krampus");

module.exports = {
  name: "profilepic",
  description: "Obtén la foto de perfil de un usuario.",
  commands: ["perfil", "pfp"],
  usage: `${PREFIX}profilepic @usuario`,
  handle: async ({ args, socket, remoteJid, sendReply, sendReact, isReply, replyJid }) => {
    let userJid;

    if (isReply) {
      // Si el comando es una respuesta a un mensaje, obtenemos el JID del destinatario
      userJid = replyJid;
    } else if (args.length < 1) {
      await sendReply("Uso incorrecto. Usa el comando así:\n" + `${PREFIX}pfp @usuario o usalo con alguien`);
      return;
    } else {
      // Si el comando no es una respuesta, obtenemos el JID del argumento (usuario etiquetado)
      userJid = args[0].replace("@", "") + "@s.whatsapp.net";
    }

    try {
      // Obtener la foto de perfil del usuario
      const profilePicUrl = await socket.profilePictureUrl(userJid, "image");

      if (profilePicUrl) {
        await sendReply(`umm...\n> Krampus Bot👻`);
        await sendReact("📸");
        await socket.sendMessage(remoteJid, { image: { url: profilePicUrl }, caption: `Foto de perfil cargada...` });
      } else {
        await sendReply(`No se pudo obtener la foto de perfil de @${args[0] || userJid.split('@')[0]}.`);
      }
    } catch (error) {
      console.error("Error al obtener la foto de perfil:", error);
      await sendReply("No tiene foto de perfil o es inaccesible.");
    }
  },
};