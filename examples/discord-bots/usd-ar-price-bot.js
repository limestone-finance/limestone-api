//Format logs
require('console-stamp')(console, '[HH:MM:ss.l]');

const Discord = require('discord.js');
const Limestone = require("../../index.js");
const Client = new Discord.Client();

Client.on("ready", async () => {
  let value = 0;

  Client.user.setActivity("powered by Limestone");

  setInterval(async () => {
    try {
      const priceFeed = await Limestone.getPrice("AR");
      const price = "$" + priceFeed.price + " = 1 AR";
      console.log(price);
      Client.guilds.cache.forEach(guild => {
        guild.me.setNickname(price);
      })
    } catch (err) {
      console.log("Error fetching current price:");
      console.log(err);
    }
  }, 5000);
});

Client.login(process.env.BOT_TOKEN);
