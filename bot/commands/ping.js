import { SlashCommandBuilder, MessageFlags } from 'discord.js';

const name = 'ping'
const data = new SlashCommandBuilder().setName(name).setDescription('Testing!');

async function execute (interaction) {
    interaction.reply({ content: 'pong!', flags: MessageFlags.Ephemeral });
}

export { name, data, execute };