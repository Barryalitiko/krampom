const { PREFIX } = require("../../krampus");
const fs = require("fs");
const path = require("path");

module.exports = {
name: "menu2",
description: "Muestra el menú de comandos detallado.",
commands: ["menu2"],
usage: `${PREFIX}menu2`,
handle: async ({ socket, remoteJid, sendReply }) => {
const menuMessage = `»»————- - ————-««
> 𝗞𝗿𝗮𝗺𝗽𝘂𝘀 𝗢𝗠 𝗯𝗼𝘁

═════════.K.═

COMANDOS:

═.K.═════════

𝗔𝗗𝗠𝗜𝗡𝗦

⌠⅏⌡➟ ${PREFIX}cerrar
  ↳ cierra el grupo
⌠⅏⌡➟ ${PREFIX}abrir
  ↳ abre el grupo
⌠⅏⌡➟ ${PREFIX}antilink 0-1-2
  ↳ con la opcion 1 banea solo links de grupos, con la opcion 2 cualquier tipo de link. Con la opcion 0 se apaga
⌠⅏⌡➟ ${PREFIX}sx on-off
  ↳ apaga o enciende los comandos con contenido +18
⌠⅏⌡➟ ${PREFIX}promote
  ↳ dar admin a alguien
⌠⅏⌡➟ ${PREFIX}demote
  ↳ quitar admin a alguien
⌠⅏⌡➟ ${PREFIX}bienvenida 0-1-2
  ↳ con la opcion 1 envia un saludo a los nuevos en el grupo, con la opcion 2 envia el saludo junto a su foto de perfil. Con la opcion 0 se apaga
⌠⅏⌡➟ ${PREFIX}cambiarenlace
  ↳ cambia el link del grupo
⌠⅏⌡➟ ${PREFIX}reaccion on-off
  ↳ para apagar las reacciones del bot con emojis a ciertas palabras
⌠⅏⌡➟ ${PREFIX}tag
  ↳ etiqueta a todos con un mensaje que se le indique
⌠⅏⌡➟ ${PREFIX}todos
  ↳ etiqueta a todos con un mensaje predeterminado
⌠⅏⌡➟ ${PREFIX}reglas
  ↳ envia las reglas del grupo

═════════.K.═

𝗠𝗜𝗘𝗠𝗕𝗥𝗢𝗦

⌠⅏⌡➟ ${PREFIX}link
  ↳ envia el link del grupo
⌠⅏⌡➟ ${PREFIX}reglas
  ↳ envia las reglas del grupo
⌠⅏⌡➟ ${PREFIX}musica/m + nombre de la canción
  ↳ usa musica o m junto al nombre de la cancion
⌠⅏⌡➟ ${PREFIX}video/v + nombre del video
  ↳ usa musica o v junto al nombre de la cancion
⌠⅏⌡➟ ${PREFIX}sticker/s
  ↳ usa sticker o s en una imagen para convertirla a sticker
⌠⅏⌡➟ ${PREFIX}reporte/r
  ↳ usa reporte o r para avisar a los administradores
⌠⅏⌡➟ ${PREFIX}ping
⌠⅏⌡➟ ${PREFIX}pfp/perfil
  ↳ usa pfp o perfil para obtener la foto de perfil de alguien
⌠⅏⌡➟ ${PREFIX}fotogrupo
  ↳ pata enviar la foto del grupo

═.K.═════════

𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦 𝗦𝗫

⌠⅏⌡➟ ${PREFIX}tijera
⌠⅏⌡➟ ${PREFIX}beso
⌠⅏⌡➟ ${PREFIX}penetrar
⌠⅏⌡➟ ${PREFIX}tocar
⌠⅏⌡➟ ${PREFIX}haiti
⌠⅏⌡➟ ${PREFIX}saborear

»»————- - ————-««
Operacion Marshall
»»————- - ————-««`;

    await socket.sendMessage(remoteJid, {
  video: fs.readFileSync("assets/sx/menu2.mp4"),
  caption: menuMessage,
  gifPlayback: true,
});
},
};
