const { PREFIX } = require("../../krampus");

module.exports = {
  name: "groupProfilePic",
  description: "Envía la foto de perfil del grupo.",
  commands: ["fotogrupo", "gpfp"],
  usage: `${PREFIX}grupofoto`,
  handle: async ({ socket, remoteJid, sendReply }) => {
    try {
      // Verificar si el comando se ejecuta en un grupo
      if (!remoteJid.endsWith("@g.us")) {
        await sendReply("Este comando solo puede usarse en grupos.");
        return;
      }

      // Obtener la URL de la foto de perfil del grupo
      const groupProfilePic = await socket.profilePictureUrl(remoteJid, "image");

      if (groupProfilePic) {
        await sendReply("📸 Obteniendo la foto de perfil del grupo...");
        await socket.sendMessage(remoteJid, {
          image: { url: groupProfilePic },
          caption: "Foto de perfil del grupo.",
        });
      } else {
        await sendReply("❌ Este grupo no tiene foto de perfil.");
      }
    } catch (error) {
      console.error("Error al obtener la foto de perfil del grupo:", error.message);
      await sendReply("❌ No se pudo obtener la foto de perfil del grupo.");
    }
  },
};
