const { PREFIX } = require("../../krampus");
const { Hercai } = require("hercai");
const { WarningError } = require("../../errors/WarningError");

module.exports = {
  name: "imagen",
  description: "Genera imagenes",
  commands: ["jpg", "img", "imagen"],
  usage: `${PREFIX}imagen <descripcion>`,
  handle: async ({
    fullArgs,
    sendWaitReact,
    sendSuccessReact,
    sendImageFromURL,
  }) => {
    if (!fullArgs.length) {
      throw new WarningError(
        "Vaya...\nañade una descripcion para generar la imagen\n> Krampus OM bot"
      );
    }

    const herc = new Hercai();

    await sendWaitReact();

    const response = await herc.drawImage({
      model: "simurg",
      prompt: `Generate a realistic image, 
without deviating from the proposed theme below (attention, it may come in Portuguese, 
translate it into English first):
      
${fullArgs}`,
      negative_prompt: "nude, explicit, adult, nsfw",
    });

    await sendSuccessReact();

    await sendImageFromURL(response.url);
  },
};
