const { PREFIX } = require("../../krampus");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "menu",
  description: "Muestra el menú de comandos.",
  commands: ["menu", "help", "ayuda"],
  usage: `${PREFIX}menu`,
  handle: async ({ socket, remoteJid, sendReply }) => {
    const menuMessage = `»»————- - ————-««
> 𝗞𝗿𝗮𝗺𝗽𝘂𝘀 𝗢𝗠 𝗯𝗼𝘁
usa ${PREFIX}menu2 para ver mas detalles
══════════.K.═ 
COMANDOS: 
═.K.═════════
𝗔𝗗𝗠𝗜𝗡𝗦
⌠⅏⌡➟ ${PREFIX}cerrar
⌠⅏⌡➟ ${PREFIX}abrir
⌠⅏⌡➟ ${PREFIX}antilink 0-1-2
⌠⅏⌡➟ ${PREFIX}sx on-off
⌠⅏⌡➟ ${PREFIX}promote
⌠⅏⌡➟ ${PREFIX}demote
⌠⅏⌡➟ ${PREFIX}bienvenida 0-1-2
⌠⅏⌡➟ ${PREFIX}cambiarenlace
⌠⅏⌡➟ ${PREFIX}reaccion on-off
⌠⅏⌡➟ ${PREFIX}tag
⌠⅏⌡➟ ${PREFIX}todos
⌠⅏⌡➟ ${PREFIX}reglas
⌠⅏⌡➟ ${PREFIX}ban
══════════.K.═
𝗠𝗜𝗘𝗠𝗕𝗥𝗢𝗦
⌠⅏⌡➟ ${PREFIX}link
⌠⅏⌡➟ ${PREFIX}menu
⌠⅏⌡➟ ${PREFIX}menu2
⌠⅏⌡➟ ${PREFIX}reglas
⌠⅏⌡➟ ${PREFIX}musica/m + nombre de la canción
⌠⅏⌡➟ ${PREFIX}video/v + nombre del video
⌠⅏⌡➟ ${PREFIX}sticker/s
⌠⅏⌡➟ ${PREFIX}reporte/r
⌠⅏⌡➟ ${PREFIX}ping
⌠⅏⌡➟ ${PREFIX}pfp/perfil
⌠⅏⌡➟ ${PREFIX}fotogrupo
═.K.═════════
𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦 𝗦𝗫
⌠⅏⌡➟ ${PREFIX}tijera
⌠⅏⌡➟ ${PREFIX}beso
⌠⅏⌡➟ ${PREFIX}penetrar
⌠⅏⌡➟ ${PREFIX}tocar
⌠⅏⌡➟ ${PREFIX}haiti
⌠⅏⌡➟ ${PREFIX}saborear
»»————- - ————-««
> Operacion Marshall
»»————- - ————-««`;

    await socket.sendMessage(remoteJid, {
      video: fs.readFileSync("assets/sx/menu.mp4"),
      caption: menuMessage,
      gifPlayback: true,
    });
  },
};


