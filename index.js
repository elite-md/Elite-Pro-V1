const { WhatsAppClient, loadCommands, getCommand } = require('easy-baileys');


(async () => {
    try {
        // Initialize WhatsAppClient with MultiFile authentication
        const clientMulti = await WhatsAppClient.create("multi", './authFiles', {
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            printQRInTerminal: false, // Set to true for QR code in terminal // now try wait
            mobile: true,
        });
        const sock = await clientMulti.getSocket();
        // Load commands from the specified directory
        await loadCommands('./Commands');
        // Example event listener for incoming messages
        // Listen for new messages
        sock.ev.on("messages.upsert", async ({ messages }) => {
            for (const m of messages) {
                const { message } = m;
                const messageTypes = ['extendedTextMessage', 'conversation', 'imageMessage', 'videoMessage'];

                // Extract text from the message if it matches any of the specified types
                let text = messageTypes.reduce((acc, type) =>
                    acc || (message[type] && (message[type].text || message[type].caption || message[type])) || '', '');

                // Convert the extracted text to lowercase for processing
                const response = text.toLowerCase();
                const prefix = ['!', '/', '.']; // Prefixes to identify commands

                // Check if the message starts with the prefix
                if (!prefix.some(p => response.startsWith(p))) {
                    continue;
                }

                // Parse command name and arguments
                const [commandName, ...args] = response.slice(prefix.length).trim().split(/\s+/);

                // Get the corresponding command handler
                const command = await getCommand(commandName);

                // If the command is not found, log and continue
                if (!command) {
                    console.log(`Command not found: ${commandName}`);
                    continue;
                }

                // Execute the command
                try {
                    await command.execute(sock, m, args);
                } catch (cmdError) {
                    console.error(`Error executing command '${commandName}':`, cmdError.message);
                }
            }
        });

    } catch (error) {
        console.error('Error initializing WhatsApp client with MultiFile authentication:', error.message);
    }
})();