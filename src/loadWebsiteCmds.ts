import {LoadCommands} from "./util/handle.js";
import {writeFileSync} from "fs";

LoadCommands().then((cmds) =>{
  cmds.map((cmd) =>{
    cmd.filepath = `src/commands/${cmd.category}/${cmd.filepath}`;
  });
  writeFileSync("dist/cmd.json", JSON.stringify(cmds));
});
