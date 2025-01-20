import { SlashCommandBuilder } from 'discord.js';

const name = 'ping'

function create () {
    return new SlashCommandBuilder().setName(name).setDescription('Replys with Pong!');
}

async function execute (interaction) {
    interaction.reply({ content: 'pong!', ephemeral: true });
}

export { name, create, execute };