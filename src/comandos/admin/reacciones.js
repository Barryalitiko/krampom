const fs = require("fs");
const path = require("path");

const { PREFIX } = require("../../krampus");
const autoreactionsPath = path.resolve(process.cwd(), "assets/autoreactions.json");

module.exports = {
  name: "autoreactions",
  description: "Activa o desactiva las auto-reacciones en el grupo.",
  commands: ["autoreactions", "reaccion"],
  usage: `${PREFIX}autoreactions <on|off>`,
  handle: async ({ args, sendReply }) => {
    if (args.length < 1) {
      await sendReply(`Uso incorrecto. Usa:\n${PREFIX}autoreactions <on|off>`);
      return;
    }

    const config = JSON.parse(fs.readFileSync(autoreactionsPath, "utf-8"));
    const action = args[0].toLowerCase();

    if (action === "on") {
      config.enabled = true;
      fs.writeFileSync(autoreactionsPath, JSON.stringify(config, null, 2));
      await sendReply("✅ Las auto-reacciones han sido activadas.");
    } else if (action === "off") {
      config.enabled = false;
      fs.writeFileSync(autoreactionsPath, JSON.stringify(config, null, 2));
      await sendReply("✅ Las auto-reacciones han sido desactivadas.");
    } else {
      await sendReply(`Opción no válida. Usa:\n${PREFIX}autoreactions <on|off>`);
    }
  },
};
