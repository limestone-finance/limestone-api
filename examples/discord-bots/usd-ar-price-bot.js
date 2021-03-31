const Limestone = require("../../index.js");
const { runSimpleDiscordBot } = require("./simple-discord-bot");

runSimpleDiscordBot({
  titleGetter: async () => {
    const priceFeed = await Limestone.getPrice("AR");
    return `$${priceFeed.price} = 1 AR`;
  },
  botToken: process.env.BOT_TOKEN,
});
