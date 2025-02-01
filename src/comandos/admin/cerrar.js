const { PREFIX } = require("../../krampus");

module.exports = {
  name: "cerrar",
  description: "Cierra el grupo, solo si el bot tiene permisos de administrador.",
  commands: ["cerrar"],
  usage: `${PREFIX}cerrar`,
  handle: async ({ socket, remoteJid, sendReply }) => {
    try {
      // Verificar si el comando se está ejecutando en un grupo
      if (!remoteJid.endsWith("@g.us")) {
        await sendReply("❌ Este comando solo puede usarse en grupos.");
        return;
      }

      // Intentar cerrar el grupo
      await socket.groupSettingUpdate(remoteJid, "announcement");
      await sendReply("🔒 El grupo ha sido cerrado. Solo los administradores pueden enviar mensajes.");
    } catch (error) {
      console.error("Error al intentar cerrar el grupo:", error);
      await sendReply("❌ No se pudo cerrar el grupo. Asegúrate de que el bot es administrador.");
    }
  },
};