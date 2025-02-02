const { PREFIX } = require("../../krampus");

module.exports = {
  name: "admin",
  description: "Promueve o degrada a un administrador en el grupo.",
  commands: ["promote", "demote"],
  usage: `${PREFIX}promote @usuario\n${PREFIX}demote @usuario`,
  handle: async ({ args, remoteJid, commandName, sendReply, socket, sendReact }) => {
    if (!remoteJid.endsWith("@g.us")) {
      await sendReply("Este comando solo puede usarse en grupos.");
      return;
    }

    if (args.length < 1) {
      await sendReply(
        `Uso incorrecto. Ejemplo:\n${PREFIX}promote @usuario\n${PREFIX}demote @usuario`
      );
      return;
    }

    const mentionedUser = args[0].replace("@", "").replace(/\D/g, "") + "@s.whatsapp.net";

    try {
      if (commandName === "promote") {
        await socket.groupParticipantsUpdate(remoteJid, [mentionedUser], "promote");
        await sendReact("👮🏻‍♂️");
        await sendReply(`@${args[0]} ahora es administrador.`);
      } else if (commandName === "demote") {
        await socket.groupParticipantsUpdate(remoteJid, [mentionedUser], "demote");
        await sendReact("❌");
        await sendReply(`@${args[0]} ya no es administrador.`);
      }
    } catch (error) {
      console.error("Error al actualizar administrador:", error);
      await sendReply("Hubo un error al realizar la acción.");
    }
  },
};