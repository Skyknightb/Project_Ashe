module.exports = client => {
  console.log(`Logged in as ${client.user.tag}! \nI'm ready!`);
  client.user.setActivity("Dragonforce", {type: "Listening"})
};
