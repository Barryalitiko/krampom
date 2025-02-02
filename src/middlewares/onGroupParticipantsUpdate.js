const { getProfileImageData } = require("../services/baileys");
const fs = require("fs");
const { onlyNumbers } = require("../utils");
const { isActiveWelcomeGroup, getWelcomeMode } = require("../utils/database");
const { warningLog } = require("../utils/logger");

exports.onGroupParticipantsUpdate = async ({ groupParticipantsUpdate, socket }) => {
const remoteJid = groupParticipantsUpdate.id;
const userJid = groupParticipantsUpdate.participants[0];

if (!isActiveWelcomeGroup(remoteJid)) {
return;
}

const welcomeMode = getWelcomeMode(remoteJid);

if (groupParticipantsUpdate.action === "add") {
try {
let buffer = null;
let profileImage = null;

  if (welcomeMode === "2") {
    ({ buffer, profileImage } = await getProfileImageData(socket, userJid));
  }

  const welcomeMessage = `¡𝗕𝗶𝗲𝗻𝘃𝗲𝗻𝗶𝗱@ 𝗮𝗹 𝗴𝗿𝘂𝗽𝗼! @${userJid ? onlyNumbers(userJid) : ''} \n\nPresentateᶜᵒⁿ 𝐟𝐨𝐭𝐨 y 𝐧𝐨𝐦𝐛𝐫𝐞 \n>Bot by Krampus OM Oᴘᴇʀᴀᴄɪᴏɴ Mᴀʀsʜᴀʟʟ ༴༎𝙾𝙼༎ \n> https://t.me/krampusiano`;

  if (welcomeMode === "2") {
    await socket.sendMessage(remoteJid, {
      image: buffer,
      caption: welcomeMessage,
      mentions: [userJid],
    });

    if (!profileImage.includes("default-user")) {
      fs.unlinkSync(profileImage);
    }
  } else {
    await socket.sendMessage(remoteJid, {
      text: welcomeMessage,
      mentions: [userJid],
    });
  }
} catch (error) {
  warningLog("👻 𝙺𝚛𝚊𝚖𝚙𝚞𝚜.𝚋𝚘𝚝 👻 No se pudo enviar el mensaje de Bienvenida");
}
}
};
