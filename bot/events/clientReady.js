import fs from 'fs';

export async function execute(client) {
    const files = fs.readdirSync('./commands')
        .filter((file) => file.endsWith('.js'))
        .map((file) => file.slice(0, -3));

    for (let file of files) {
        console.log(`Attempting to load ${file} command`);
        const command = await import(`#commands/${file}`);
        if ('name' in command && 'execute' in command && 'create' in command) {
            console.log(`Creating ${command.name} command`);
            client.commands.set(command.name, command.create());
        }
    }

    console.log(`Successfully logged in as ${client.user.tag}`);
}