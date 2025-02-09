import fs from 'fs';

export async function execute(client) {
    const files = fs.readdirSync('./commands')
        .filter((file) => file.endsWith('.js'))
        .map((file) => file.slice(0, -3));

    for (let file of files) {
        console.log(`Attempting to load ${file} command`);
        const command = await import(`#commands/${file}`);
        if ('name' in command && 'execute' in command && 'data' in command) {
            console.log(`Creating ${command.data.name} command`);
            client.commands.set(command.data.name, command);
        }
    }

    console.log(`Successfully logged in as ${client.user.tag}`);
}

export const once = true