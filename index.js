const { Client, GatewayIntentBits } = require("discord.js");
const { token, channelIds, roleId, excludedRoleIds } = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const KEYWORDS = [
  "live ce soir",
  "il live tw",
  "il live aujourd'hui tw",
];

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  if (channelIds.includes(message.channel.id)) {
    const content = message.content.toLowerCase();

    // Vérifiez si l'utilisateur a un rôle exclu
    if (message.member && !message.member.roles.cache.some(role => excludedRoleIds.includes(role.id))) {
     
      if (KEYWORDS.some((keyword) => content.includes(keyword))) {
        executeKeywordAction(message);
      }

    }    
  }
});

function executeKeywordAction(message) {
  const member = message.member;
  const role = message.guild.roles.cache.find(
    (r) => r.id === roleId
  );

  if (role && member) {
    member.roles.add(role);
    message.channel.send(
      `Attention, <@${member.user.id}> ! Cela fait plusieurs fois qu'on rappel à tout le monde d'arrêter de demander si TW live ou non ce soir. Vous avez maintenant le grade **avertissement**, si vous êtes repris à demander vous serez ban définitivement.`
    );
  }
}

client.login(token);

