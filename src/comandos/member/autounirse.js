const { PREFIX } = require("../../krampus");

module.exports = {
  name: "unirse",
  description: "Hace que el bot se una a un grupo mediante un enlace de invitación.",
  commands: ["unirse", "join"],
  usage: `${PREFIX}unirse [enlace]`,
  handle: async ({ args, sendReply, socket }) => {
    const invitationLink = args[0];

    if (!invitationLink) {
      await sendReply(`Por favor, proporciona un enlace de invitación al grupo.`);
      return;
    }

    try {
      const groupJid = invitationLink.split("https://chat.whatsapp.com/")[1];
      if (!groupJid) {
        await sendReply("El enlace proporcionado no es válido.");
        return;
      }

      await socket.joinGroup(groupJid);
      await sendReply(`✅ El bot se ha unido correctamente al grupo con el enlace proporcionado.`);
    } catch (error) {
      console.error("Error al unirse al grupo:", error);
      await sendReply("❌ Hubo un error al intentar unirse al grupo. Verifica el enlace e intenta de nuevo.");
    }
  },
};