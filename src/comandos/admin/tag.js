const { PREFIX } = require("../../krampus");

module.exports = {
  name: "hide-tag",
  description: "Para mencionar a todos",
  commands: ["tag", "t"],
  usage: `${PREFIX}hidetag motivo`,
  handle: async ({ fullArgs, sendText, socket, remoteJid, sendReact }) => {
    const { participants } = await socket.groupMetadata(remoteJid);

    const mentions = participants.map(({ id }) => id);

    await sendReact("📎");

    await sendText(`\n\n${fullArgs}`, mentions);
  },
};
