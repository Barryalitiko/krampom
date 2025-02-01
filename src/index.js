const { connect } = require("./connect");
const { load } = require("./loader");
const { infoLog, bannerLog } = require("./utils/logger");

async function start() {
  try {
    bannerLog();
    infoLog("Kram está procesando...");

    const socket = await connect();

    load(socket);
  } catch (error) {
    console.log(error);
  }
}

start();
