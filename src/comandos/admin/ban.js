const { PREFIX, BOT_NUMBER } = require("../../krampus");
const { DangerError } = require("../../errors/DangerError");
const { InvalidParameterError } = require("../../errors/InvalidParameterError");
const { toUserJid, onlyNumbers } = require("../../utils");

module.exports = {
  name: "ban",
  description: "Banear",
  commands: ["ban", "kick"],
  usage: `ban`,
  handle: async ({
    args,
    isReply,
    socket,
    remoteJid,
    replyJid,
    sendReply,
    userJid,
    sendBasuraReact,
  }) => {
    if (!args.length && !isReply) {
      throw new InvalidParameterError(
        "Tienes que decirme a quien quieres que elimine \nKrampusOMbot"
      );
    }

    const memberToRemoveJid = isReply ? replyJid : toUserJid(args[0]);
    const memberToRemoveNumber = onlyNumbers(memberToRemoveJid);

    if (memberToRemoveNumber.length < 7 || memberToRemoveNumber.length > 15) {
      throw new InvalidParameterError("𝙽𝚞́𝚖𝚎𝚛𝚘 𝚗𝚘 in𝚟𝚊𝚕𝚒𝚍𝚘\n> KrampusOMbot");
    }

    if (memberToRemoveJid === userJid) {
      throw new DangerError("𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚎 𝚛𝚎𝚊𝚕𝚒𝚣𝚊𝚛 𝚕𝚊 𝚊𝚌𝚌𝚒𝚘́𝚗\n> KrampusOMbot");
    }

    const botJid = toUserJid(BOT_NUMBER);

    if (memberToRemoveJid === botJid) {
      throw new DangerError("𝙽𝚘 𝚜𝚎 𝚙𝚞𝚎𝚍𝚎 𝚛𝚎𝚊𝚕𝚒𝚣𝚊𝚛 𝚕𝚊 𝚊𝚌𝚌𝚒𝚘́𝚗\n> KrampusOMbot");
    }

    await socket.groupParticipantsUpdate(
      remoteJid,
      [memberToRemoveJid],
      "remove"
    );

    await sendBasuraReact();

    await sendReply("Upss... He sacado la basura\n> KrampusOMbot");
  },
};
