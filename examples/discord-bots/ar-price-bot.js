const limestone = require("../../lib/index.js");
const { runSimpleDiscordBot } = require("./simple-discord-bot");

runSimpleDiscordBot({
  titleGetter: async () => {
    const priceFeed = await limestone.getPrice("AR");
    return `$${priceFeed.value.toFixed(2)} = 1 AR`;
  },
  botToken: process.env.BOT_TOKEN,
});
