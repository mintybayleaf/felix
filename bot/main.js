import {} from 'dotenv/config';
import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds]});
client.commands = new Collection();
client.events = new Collection();

// Register events to load and execute
client.events.set(Events.ClientReady, { file: '#events/clientReady', once: true });
client.events.set(Events.InteractionCreate, { file: '#events/interactionCreate', once: false });

// Register event handlers
for (const [name, e] of client.events.entries()) {
    console.log(`Attempting to load event handler ${e.file} for event ${name}`);
    const event = await import(e.file);
    if (e.once) {
        client.once(name, (...args) => {
            event.execute(...args);
        });
    } else {
        client.on(name, (...args) => {
            event.execute(...args);
        });
    }
}

// Log in to Discord with the client's token
client.login(process.env.DISCORD_BOT_TOKEN);
