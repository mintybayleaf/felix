import {} from 'dotenv/config';
import { REST, Routes } from 'discord.js';
import fs from 'fs';

async function loadCommands() {
    const commands = []
    const files = fs.readdirSync('./commands')
        .filter((file) => file.endsWith('.js'))
        .map((file) => file.slice(0, -3));

    for (let file of files) {
        console.log(`Attempting to load ${file} command`);
        const command = await import(`#commands/${file}`);
        if ('name' in command && 'execute' in command && 'create' in command) {
            console.log(`Registering ${command.name} command`);
            commands.push(command.create().toJSON());
        }
    }
    return commands;
}

// Deploys commands globally or via a guildId
async function deploy(botToken, clientId, guildId) {
    console.log(botToken, clientId, guildId);
    const rest = new REST().setToken(botToken);
    const commands = await loadCommands();
    const routeKey = guildId ? Routes.applicationCommands(clientId) : Routes.applicationGuildCommands(clientId, guildId)
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(routeKey, { body: commands });
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
}

async function main() {
    const botToken = process.env.DISCORD_BOT_TOKEN;
    const clientId = process.env.DISCORD_CLIENT_ID;

    const args = process.argv.slice(2);
    const guildId = args[0] || process.env.DISCORD_GUILD_ID;

    await deploy(botToken, clientId, guildId);
}

// Run Main
await main()