module.exports = {
    usage: ["alive", 'online'], // u can add mutiple usage for a commane like ["ping", "pong"] like that
        desc: "Check bot is online.",
    commandType: "Bot",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: '🏓', // Ping pong emoji for fun

    async execute(sock, m) { // For more messsage sending methods and other things u can learn by reading this how can i add session id to my readme yo ceate your own method check on youtube there is one video
        try {

            await sock.reply(m, `🚀 Hey ! i am alive`);
        } catch (error) {
            await sock.reply(m, "❌ An error occurred while checking the Alive: " + error);
        }
    }
};