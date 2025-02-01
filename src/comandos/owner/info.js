const { PREFIX } = require("../../krampus"); // Para acceder al prefix

module.exports = {
  name: "grupos",
  description: "Obtener información de los grupos donde está el bot",
  commands: ["grupos", "grupos-info"],
  usage: `${PREFIX}grupos`,
  cooldown: 60, // 1 minuto de cooldown
  handle: async ({ socket, sendReply, sendReact }) => {
    try {
      console.log("[GRUPOS] Comando ejecutado.");
      await sendReact("⏳"); // Reacciona con el emoji de espera

      console.log("[GRUPOS] Obteniendo información de grupos...");
      const groupMetadata = await socket.groupFetchAllParticipating(); // Obtener todos los grupos
      const groupsInfo = Object.values(groupMetadata);

      console.log("[GRUPOS] Grupos encontrados:", groupsInfo.length);
      if (!groupsInfo.length) {
        console.log("[GRUPOS] El bot no está en ningún grupo.");
        await sendReply("El bot no está en ningún grupo.");
        return;
      }

      let response = `👥 *Información de Grupos:* 👥\n\n`;

      for (const group of groupsInfo) {
        const groupName = group.subject || "Sin Nombre";
        console.log(`[GRUPOS] Procesando grupo: ${groupName}`);
        
        let groupLink = "No disponible";
        try {
          groupLink = await socket.groupInviteCode(group.id);
          console.log(`[GRUPOS] Enlace del grupo "${groupName}": https://chat.whatsapp.com/${groupLink}`);
        } catch (linkError) {
          console.error(`[GRUPOS] Error al obtener el enlace del grupo "${groupName}":`, linkError);
        }

        const groupUsers = group.participants?.length || 0;
        console.log(`[GRUPOS] Usuarios en el grupo "${groupName}": ${groupUsers}`);

        response += `🌟 *Nombre del Grupo:* ${groupName}\n`;
        response += `🔗 *Enlace:* https://chat.whatsapp.com/${groupLink}\n`;
        response += `👤 *Usuarios:* ${groupUsers}\n\n`;
      }

      console.log("[GRUPOS] Respuesta generada:\n", response);
      await sendReply(response);
      await sendReact("✅"); // Reacciona con el emoji de éxito
    } catch (error) {
      console.error("[GRUPOS] Error al obtener información de los grupos:", error);
      await sendReply("Hubo un error al intentar obtener la información de los grupos.");
      await sendReact("❌"); // Reacciona con el emoji de error
    }
  },
};