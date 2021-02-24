const axios = require("axios");
const Limestone = require("../../index.js");
const { runSimpleDiscordBot } = require("./simple-discord-bot");

async function getCurrentARPricePerGB() {
  const response = await axios.get("https://arweave.net/price/1048576");
  return response.data * 0.000000000001;
}

runSimpleDiscordBot({
  titleGetter: async () => {
    const priceFeed = await Limestone.getPrice("AR");
    const arPricePerGB = await getCurrentARPricePerGB();
    const usdPricePerGB = arPricePerGB * priceFeed.price;
    const usdPricePerGBFormatted = +usdPricePerGB.toFixed(6);
    return `$${usdPricePerGBFormatted} = 1 GB`;
  },
  botToken: process.env.BOT_TOKEN,
});
