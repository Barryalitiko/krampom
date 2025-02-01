const { PREFIX } = require("../../krampus"); // Asegúrate de que este archivo tenga el prefijo configurado

module.exports = {
  name: "contacto",
  description: "Envía el número de teléfono de un contacto respondiendo o etiquetando",
  commands: [`${PREFIX}contacto`],
  usage: `${PREFIX}contacto`,
  handle: async ({ sendReply, sendReact, webMessage, socket, remoteJid }) => {
    try {
      await sendReact("⏳"); // Reaccionamos con el emoji de espera

      let contactJid = null;

      // Si es una respuesta a un mensaje
      if (webMessage.message.extendedTextMessage && webMessage.message.extendedTextMessage.contextInfo) {
        contactJid = webMessage.message.extendedTextMessage.contextInfo.participant; // JID del contacto respondido
      }

      // Si se ha etiquetado a un usuario
      if (webMessage.message["mentionedJidList"] && webMessage.message["mentionedJidList"].length > 0) {
        contactJid = webMessage.message["mentionedJidList"][0]; // JID del primer usuario etiquetado
      }

      if (!contactJid) {
        return await sendReply("Por favor, responde a un mensaje o etiqueta a un usuario para obtener su número.");
      }

      // Extraer el número de teléfono del JID
      const userNumber = contactJid.split("@")[0]; // Extraemos el número del JID

      // Enviar el número como contacto
      await socket.sendMessage(remoteJid, {
        contact: {
          displayName: "Contacto",
          phoneNumber: userNumber,
        },
      });

      console.log("[CONTACTO] Contacto enviado:", userNumber);

      await sendReact("✅"); // Reaccionamos con el emoji de éxito
      await sendReply(`El número de teléfono del contacto es: ${userNumber}`);
    } catch (error) {
      console.error("[CONTACTO] Error:", error);
      await sendReact("❌"); // Reaccionamos con el emoji de error
      await sendReply("Hubo un error al intentar obtener el contacto.");
    }
  },
};