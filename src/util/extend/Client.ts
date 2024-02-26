import Collection from "@discordjs/collection";
import {ConfigObject, AdvancedConfig, create, Client as WaClient, Message} from "@open-wa/wa-automate";
import {prefix} from "../settings.js";
import {LoadCommands, commandInterface} from "../handle.js";
import {connect} from "../db/Mongo.js";

export interface MoreOptions {
  mongoUrl?:string
}

export class Client {
  options: ConfigObject | AdvancedConfig | undefined;
  clientInstances?: WaClient;
  commands?: Collection<string, commandInterface>;
  MongoUrl?: string;
  Whitelist?: boolean;
  SoftWhitelist?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  secret: any;
  constructor(options?:ConfigObject|AdvancedConfig, AdvanceOptions?:MoreOptions) {
    this.MongoUrl = AdvanceOptions?.mongoUrl;
    this.options = options;
    this.Whitelist = false;
    this.SoftWhitelist = false;
  }


  public get uptime() : number {
    return Date.now();
  }

  async start() {
    const Client = await create(this.options);
    await this.assignProperty();
    if (this.MongoUrl) {
      await connect(this.MongoUrl);
    }
    this.clientInstances = Client;
    return this.clientInstances;
  }

  setSecret(string:string) {
    if (string.length > 1) {
      this.secret = JSON.parse(string);
    }
    return this;
  }

  setWhitelist(InitVal:boolean, SoftWhitelist?:boolean) {
    this.SoftWhitelist = SoftWhitelist || false;
    this.Whitelist = InitVal;
  }

  private async assignProperty() {
    this.commands = await LoadCommands();
    return;
  }

  get client() {
    if (!this.clientInstances) throw Error("No client initializedf");
    return this.clientInstances;
  }

  parseMessage(msg:Message) {
    let text = msg.body;
    if (msg.type !== "chat") {
      text = "";
      if (msg.isMedia) {
        text = msg.caption;
        if (!msg.caption) {
          text = "";
        }
      }
    }


    const isPrefixed= text.startsWith(prefix) ? true : false;

    const args = isPrefixed ? text.slice(prefix.length).split(" ") : text.split(" ");
    const first = args.shift()?.toLowerCase();
    let isCommand = false;
    let commands;
    if (isPrefixed) {
      commands = this.commands!.find((o)=>o.name === first) || this.commands!.find((c) => c.alias.includes(first!.toLowerCase()));
      if (commands) {
        isCommand = true;
      }
    }
    return {text, isCommand, args, first, commands};
  }

  handleCommand(msg:Message) {
    const parsedMessage = this.parseMessage(msg);
    if (parsedMessage.isCommand) {
      if (this.Whitelist && !this.SoftWhitelist && !msg.fromMe) {
        this.clientInstances?.sendText(msg.chatId, "Whitelist Mode is on!, you cant use it now");
        return;
      } else if (this.Whitelist && this.SoftWhitelist && !msg.sender.isMyContact && !msg.fromMe) {
        this.clientInstances?.sendText(msg.chatId, "Whitelist Mode is on!, But soft Whitelist is also on, you can only use command if you added to this account contact");
        return;
      }
      this.logger(`Runned ${parsedMessage.commands!.name}`, "command");
      parsedMessage.commands!.run(this, msg);
      return;
    }
  }

  logger(text:string, type:string) {
    console.log(`[${type.toUpperCase()}] ${text}`);
  }
}
