const { DangerError } = require("../errors/DangerError");
const { InvalidParameterError } = require("../errors/InvalidParameterError");
const { WarningError } = require("../errors/WarningError");
const { findCommandImport } = require(".");
const {
verifyPrefix,
hasTypeOrCommand,
isLink,
isAdmin,
} = require("../middlewares");
const { checkPermission } = require("../middlewares/checkPermission");
const { isActiveAntiLinkGroup, getAntiLinkMode } = require("./database");
const { errorLog } = require("../utils/logger");
const { ONLY_GROUP_ID } = require("../krampus");

function isGroupLink(message) {
return message.includes("chat.whatsapp.com");
}

exports.dynamicCommand = async (paramsHandler) => {
const {
commandName,
prefix,
sendWarningReply,
sendErrorReply,
remoteJid,
sendReply,
socket,
userJid,
fullMessage,
webMessage,
} = paramsHandler;

if (isActiveAntiLinkGroup(remoteJid) && isLink(fullMessage)) {
const antiLinkMode = getAntiLinkMode(remoteJid);
if (
antiLinkMode === "2" ||
(antiLinkMode === "1" && isGroupLink(fullMessage))
) {
if (!(await isAdmin({ remoteJid, userJid, socket }))) {
await socket.groupParticipantsUpdate(remoteJid, [userJid], "remove");
await sendReply(
"Baneado por enviar link\n> Krampus OM bot"
);
await socket.sendMessage(remoteJid, {
delete: {
remoteJid,
fromMe: false,
id: webMessage.key.id,
participant: webMessage.key.participant,
},
});
return;
}
}
}

const { type, command } = findCommandImport(commandName);

if (ONLY_GROUP_ID && ONLY_GROUP_ID !== remoteJid) {
return;
}

if (!verifyPrefix(prefix) || !hasTypeOrCommand({ type, command })) {
return;
}

if (!(await checkPermission({ type, ...paramsHandler }))) {
await sendErrorReply(
"Upss... No eres administador,no tienes permitido usar el comando\nKrampus OM bot"
);
return;
}

try {
await command.handle({ ...paramsHandler, type });
} catch (error) {
if (error instanceof InvalidParameterError) {
await sendWarningReply(`Parametros inválidos! ${error.message}`);
} else if (error instanceof WarningError) {
await sendWarningReply(error.message);
} else if (error instanceof DangerError) {
await sendErrorReply(error.message);
} else {
errorLog("Error al ejecutar el comando", error);
await sendErrorReply(
`Ocurrio un error al ejecutar el comando ${command.name}! 📄 *Detalles*: ${error.message}`
);
}
}
};
