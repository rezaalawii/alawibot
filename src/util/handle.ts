import {readdirSync} from "fs";
import {Collection} from "@discordjs/collection";
import {Message} from "@open-wa/wa-automate";
import {Client} from "./extend/Client.js";

export async function LoadCommands() {
  const commands = new Collection<string, commandInterface>();
  const dirs = readdirSync("./dist/commands/", {
    withFileTypes: true,
  }).filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);

  for (const folder of dirs) {
    for (const file of readdirSync("./dist/commands/" + folder).filter((file) => file.endsWith(".ts") || file.endsWith(".js"))) {
      const command = await import(`../commands/${folder}/${file}`);
      console.log(command.name)
      commands.set(command.name.toLowerCase(), {
        name: command.name.toLowerCase(),
        alias: (command.alias || []).map((c:string) => c.toLowerCase()),
        category: folder,
        filepath: file,
        description: command.description || "",
        run: command.run,
      } as commandInterface);
    }
  }
  console.log("[Handler]"+ commands.size + " Loaded");
  return commands;
}


export interface commandInterface {
    name: string
    alias: string[]
    category: string
    filepath:string
    description:string
    run:(Client:Client, Message:Message) => void
}
