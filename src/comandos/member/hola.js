const { PREFIX } = require("../../krampus");

module.exports = {
  name: "hola",
  description: "Prueba de botones interactivos.",
  commands: ["hola", "hello"],
  usage: `${PREFIX}hola`,
  handle: async ({ socket, remoteJid, sendReply }) => {
    try {
      await socket.sendMessage(remoteJid, {
        text: "👋 ¡Hola! Este es un mensaje interactivo de prueba. ¿Qué te gustaría hacer?",
        templateMessage: {
          buttons: [
            {
              buttonId: "info",
              buttonText: { displayText: "🔗 Ver información" },
              type: 1
            },
            {
              buttonId: "contact",
              buttonText: { displayText: "📞 Contactar soporte" },
              type: 1
            }
          ]
        }
      });
    } catch (error) {
      console.error("Error al enviar el mensaje interactivo:", error);
      await sendReply("❌ Hubo un error al enviar el mensaje interactivo.");
    }
  }
};
