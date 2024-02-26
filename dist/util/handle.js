import { readdirSync } from "fs";
import { Collection } from "@discordjs/collection";
export async function LoadCommands() {
    const commands = new Collection();
    const dirs = readdirSync("./dist/commands/", {
        withFileTypes: true,
    }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
    for (const folder of dirs) {
        for (const file of readdirSync("./dist/commands/" + folder).filter((file) => file.endsWith(".ts") || file.endsWith(".js"))) {
            const command = await import(`../commands/${folder}/${file}`);
            console.log(command.name);
            commands.set(command.name.toLowerCase(), {
                name: command.name.toLowerCase(),
                alias: (command.alias || []).map((c) => c.toLowerCase()),
                category: folder,
                filepath: file,
                description: command.description || "",
                run: command.run,
            });
        }
    }
    console.log("[Handler]" + commands.size + " Loaded");
    return commands;
}
