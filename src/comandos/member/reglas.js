const { PREFIX } = require("../../krampus");

module.exports = {
  name: "descripcion",
  description: "Envía la descripción del grupo.",
  commands: ["descripcion", "desc", "description"],
  usage: `${PREFIX}descripcion`,
  handle: async ({ remoteJid, socket, sendReply }) => {
    try {
      // Obtener metadatos del grupo
      const metadata = await socket.groupMetadata(remoteJid);

      // Verificar si el grupo tiene descripción
      const description = metadata.desc || "Este grupo no tiene reglas...";

      // Enviar la descripción como respuesta
      await sendReply(`📄 *REGLAS DEL GRUPO:*\n> Krampus OM bot\n${description}`);
    } catch (error) {
      console.error("Error al obtener la descripción del grupo:", error);
      await sendReply("Ocurrió un error al intentar obtener la descripción del grupo.");
    }
  },
};