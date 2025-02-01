const { PREFIX } = require("../../krampus");
const fs = require("fs");
const path = require("path");

// Ruta del archivo JSON
const autoApproveFilePath = path.resolve(process.cwd(), "assets/autoApproveGroups.json");

// Leer el estado actual desde el archivo JSON
const readAutoApproveState = () => {
  try {
    if (!fs.existsSync(autoApproveFilePath)) {
      return {};
    }
    const data = fs.readFileSync(autoApproveFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo autoApproveGroups.json:", error);
    return {};
  }
};

// Guardar el estado actualizado en el archivo JSON
const saveAutoApproveState = (state) => {
  try {
    fs.writeFileSync(autoApproveFilePath, JSON.stringify(state, null, 2));
  } catch (error) {
    console.error("Error al guardar el archivo autoApproveGroups.json:", error);
  }
};

module.exports = {
  name: "autoapprove",
  description: "Activar o desactivar la aprobación automática de solicitudes en el grupo",
  commands: ["autoaprobar"],
  usage: `${PREFIX}autoapprove <on|off>`,
  handle: async ({ socket, remoteJid, sendReply, args }) => {
    try {
      // Verificar si el comando se ejecuta en un grupo
      if (!remoteJid.endsWith("@g.us")) {
        await sendReply("❌ Este comando solo puede usarse en grupos.");
        return;
      }

      const action = args[0];

      // Validar el argumento
      if (!action || (action !== "on" && action !== "off")) {
        await sendReply("❌ Por favor, especifica si deseas activar o desactivar la aprobación automática (`on` o `off`).");
        return;
      }

      // Leer el estado actual
      const autoApproveState = readAutoApproveState();

      if (action === "on") {
        if (autoApproveState[remoteJid]) {
          await sendReply("✅ La aprobación automática ya está activada para este grupo.");
          return;
        }
        autoApproveState[remoteJid] = true;
        saveAutoApproveState(autoApproveState);
        await sendReply("✅ La aprobación automática está ahora activada para este grupo.");
      } else if (action === "off") {
        if (!autoApproveState[remoteJid]) {
          await sendReply("❌ La aprobación automática ya está desactivada para este grupo.");
          return;
        }
        delete autoApproveState[remoteJid];
        saveAutoApproveState(autoApproveState);
        await sendReply("❌ La aprobación automática está ahora desactivada para este grupo.");
      }
    } catch (error) {
      console.error("Error en el comando autoapprove:", error);
      await sendReply("❌ Ocurrió un error al procesar el comando.");
    }
  },
  // Middleware que se puede usar en eventos de solicitudes de ingreso
  onParticipantRequest: async ({ socket, remoteJid, participantJid }) => {
    try {
      const autoApproveState = readAutoApproveState();
      if (autoApproveState[remoteJid]) {
        // Aprobar la solicitud automáticamente
        await socket.groupAcceptInvite(remoteJid, participantJid);
        console.log(`✅ Aprobada automáticamente la solicitud de ${participantJid} en el grupo ${remoteJid}`);
      }
    } catch (error) {
      console.error("Error al aprobar automáticamente:", error);
    }
  }
};