const { PREFIX } = require("../../krampus");

module.exports = {
  name: "cambiar-enlace",
  description: "Cambiar el enlace de invitación de un grupo",
  commands: [`${PREFIX}cambiarenlace`], // El comando que usará el usuario
  usage: `${PREFIX}cambiar-enlace`,
  cooldown: 180, // 3 minutos de cooldown
  handle: async ({ sendReply, sendReact, socket, remoteJid }) => {
    try {
      // Revocar el enlace actual
      await socket.groupRevokeInvite(remoteJid);
      console.log("[CAMBIO ENLACE] Enlace revocado");

      // Generar un nuevo enlace de invitación
      const newInviteCode = await socket.groupInviteCode(remoteJid);
      console.log("[CAMBIO ENLACE] Nuevo enlace generado:", newInviteCode);

      // Enviar el nuevo enlace
      await sendReply(`🔗 *Nuevo enlace de invitación del grupo:* \n\nhttps://chat.whatsapp.com/${newInviteCode}`);
      await sendReact("🔗"); // Reacción de éxito
    } catch (error) {
      console.error("[CAMBIO ENLACE] Error al cambiar el enlace:", error);
      await sendReply("❌ Hubo un error al intentar cambiar el enlace del grupo.");
      await sendReact("❌"); // Reacción de error
    }
  },
};
