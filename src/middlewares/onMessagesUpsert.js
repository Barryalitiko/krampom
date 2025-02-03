const { dynamicCommand } = require("../utils/dynamicCommand");
const { loadCommonFunctions } = require("../utils/loadCommonFunctions");
const { autoReactions } = require("../utils/autoReactions");

exports.onMessagesUpsert = async ({ socket, messages }) => {
if (!messages.length) {
return;
}

for (const webMessage of messages) {
const commonFunctions = loadCommonFunctions({ socket, webMessage });
if (!commonFunctions) {
continue;
}

const messageText = webMessage.message.conversation;
const remoteJid = webMessage.key.remoteJid;

// Auto Reacciones
for (const [keyword, emoji] of Object.entries(autoReactions)) {
  if (messageText.toLowerCase().includes(keyword)) {
    await socket.sendMessage(remoteJid, {
      react: {
        text: emoji,
        key: webMessage.key,
      },
    });
  }
}

// Comandos dinámicos
await dynamicCommand(commonFunctions);
}
};
