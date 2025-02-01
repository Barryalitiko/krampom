const { PREFIX } = require("../../krampus");

module.exports = {
  name: "ping",
  description: "Verificar se o bot está online",
  commands: ["ping"],
  usage: `${PREFIX}om`,
  handle: async ({ sendReply, sendReact }) => {
    await sendReact("👻");
    await sendReply(`Operación Marshall\n> Krampus OM bot`);
  },
};
