import {} from 'dotenv/config';
import fs from 'fs';
import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds]});
client.commands = new Collection();

const events = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'))
    .map((file) => file.slice(0, -3));

// Register event handlers
for (const event of events) {
    console.log(`Loading event handler ${event}`);
    const handler = await import(`#events/${event}`);
    if (handler.once) {
        client.once(event, (...args) => {
                handler.execute(...args)
        });
    } else {
        client.on(event, (...args) => {
            handler.execute(...args);
        });
    }
}

// Log in to Discord with the client's token
client.login(process.env.DISCORD_BOT_TOKEN);
