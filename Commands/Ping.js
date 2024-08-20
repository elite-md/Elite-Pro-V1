module.exports = {
    usage: ["ping"], // u can add mutiple usage for a commane like ["ping", "pong"] like that
        desc: "Checks the bot's response time.",
    commandType: "Bot",
    isGroupOnly: false,
    isAdminOnly: false,
    isPrivateOnly: false,
    emoji: '🏓', // Ping pong emoji for fun

    async execute(sock, m) { // For more messsage sending methods and other things u can learn by reading this how can i add session id to my readme yo ceate your own method check on youtube there is one video
        try {
            // Get the timestamp before sending the message
            const startTime = Date.now();
            const latency = Date.now() - startTime;
            await sock.reply(m, `🚀 Pong! ${latency}ms`);
        } catch (error) {
            await sock.reply(m, "❌ An error occurred while checking the ping: " + error);
        }
    }
};