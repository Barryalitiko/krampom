const fs = require('fs');
const path = require('path');
const { PREFIX } = require("../../krampus");

// Ruta del archivo donde se guardan las advertencias
const warningsFile = path.join(__dirname, "../../assets/warnings.json");

// Cargar advertencias desde un archivo
let warnings = {};
if (fs.existsSync(warningsFile)) {
  warnings = JSON.parse(fs.readFileSync(warningsFile, 'utf-8'));
}

module.exports = {
  name: 'warn',
  description: 'Sistema de advertencias para usuarios',
  commands: ['warn', 'warnlist', 'warnreset', 'warnclear'],
  usage: `${PREFIX}warn @usuario\n${PREFIX}warnreset @usuario\n${PREFIX}warnlist\n${PREFIX}warnclear`,
  handle: async ({ args, remoteJid, sendReply, socket, webMessage, mentions }) => {
    const command = args[0]?.toLowerCase();

    switch (command) {
      case 'list':
        await handleWarnList(remoteJid, sendReply);
        break;
      case 'reset':
        await handleWarnReset(remoteJid, args, sendReply, mentions);
        break;
      case 'clear':
        await handleWarnClear(remoteJid, sendReply);
        break;
      default:
        await handleWarn(remoteJid, sendReply, socket, webMessage, mentions);
    }

    saveWarnings();
  },
};

async function handleWarn(remoteJid, sendReply, socket, webMessage, mentions) {
  if (!mentions.length) {
    sendReply('Por favor, menciona al usuario que deseas advertir.');
    return;
  }

  const userId = mentions[0];
  if (!warnings[remoteJid]) warnings[remoteJid] = {};
  warnings[remoteJid][userId] = (warnings[remoteJid][userId] || 0) + 1;

  const userWarnings = warnings[remoteJid][userId];
  sendReply(`⚠️ @${userId.split('@')[0]} ha recibido una advertencia. Advertencias acumuladas: ${userWarnings}/3.`);

  if (userWarnings >= 3) {
    sendReply(`🚨 @${userId.split('@')[0]} ha sido expulsado por acumular 3 advertencias.`);
    await socket.groupParticipantsUpdate(remoteJid, [userId], 'remove');
    delete warnings[remoteJid][userId]; // Limpiar advertencias tras la expulsión
  }
}

async function handleWarnList(remoteJid, sendReply) {
  if (!warnings[remoteJid] || Object.keys(warnings[remoteJid]).length === 0) {
    sendReply('No hay usuarios con advertencias en este grupo.');
    return;
  }

  const warnList = Object.entries(warnings[remoteJid])
    .map(([userId, count], index) => `${index + 1}. @${userId.split('@')[0]} - ${count} advertencias`)
    .join('\n');

  sendReply(`Lista de usuarios advertidos:\n${warnList}`);
}

async function handleWarnReset(remoteJid, args, sendReply, mentions) {
  if (!mentions.length) {
    sendReply('Por favor, menciona al usuario cuyas advertencias deseas restablecer.');
    return;
  }

  const userId = mentions[0];
  if (warnings[remoteJid] && warnings[remoteJid][userId]) {
    delete warnings[remoteJid][userId];
    sendReply(`✅ Advertencias de @${userId.split('@')[0]} restablecidas.`);
  } else {
    sendReply(`ℹ️ @${userId.split('@')[0]} no tiene advertencias registradas.`);
  }
}

async function handleWarnClear(remoteJid, sendReply) {
  if (warnings[remoteJid]) {
    delete warnings[remoteJid];
    sendReply('✅ Todas las advertencias del grupo han sido borradas.');
  } else {
    sendReply('ℹ️ No hay advertencias registradas en este grupo.');
  }
}

function saveWarnings() {
  fs.writeFileSync(warningsFile, JSON.stringify(warnings, null, 2), 'utf-8');
}