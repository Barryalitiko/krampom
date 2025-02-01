const { PREFIX } = require("../../krampus");

// Objeto para rastrear el tiempo de uso del comando por grupo
const cooldowns = {};

module.exports = {
  name: "tagadmins",
  description: "Etiqueta a todos los administradores del grupo.",
  commands: ["reporte", "r"],
  usage: `${PREFIX}reporte`,
  handle: async ({ remoteJid, sendReply, socket }) => {
    if (!remoteJid.endsWith("@g.us")) {
      await sendReply("Este comando solo puede usarse en grupos.");
      return;
    }

    const now = Date.now();
    const cooldownTime = 90 * 1000; // 90 segundos

    // Verificar si el comando está en tiempo de espera
    if (cooldowns[remoteJid] && now - cooldowns[remoteJid] < cooldownTime) {
      const remainingTime = Math.ceil((cooldownTime - (now - cooldowns[remoteJid])) / 1000);
      await sendReply(`Espera ${remainingTime} segundos antes de volver a usar este comando.`);
      return;
    }

    try {
      // Obtener los detalles del grupo
      const groupMetadata = await socket.groupMetadata(remoteJid);
      const admins = groupMetadata.participants.filter((participant) =>
        ["admin", "superadmin"].includes(participant.admin)
      );

      if (admins.length === 0) {
        await sendReply("No hay administradores en este grupo.");
        return;
      }

      // Crear una lista con los administradores etiquetados
      const mentions = admins.map((admin) => admin.id);
      const message = "REPORTE ENVIADO A LOS ADMINISTRADORES!\n> Krampus OM bot\n" + mentions.map((id) => `@${id.split("@")[0]}`).join("\n");

      // Enviar el mensaje con menciones
      await socket.sendMessage(remoteJid, { text: message, mentions });

      // Registrar el tiempo de uso del comando
      cooldowns[remoteJid] = now;
    } catch (error) {
      console.error("Error al etiquetar administradores:", error);
      await sendReply("Ocurrió un error al intentar etiquetar a los administradores.");
    }
  },
};