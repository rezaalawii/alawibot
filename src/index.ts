import {Client} from "./util/extend/Client.js";
import "dotenv/config";
import * as settings from "./util/settings.js";
import { ContactId } from "@open-wa/wa-automate";
import { GroupNotificationTypes, ParticipantChangedEventModel } from "@open-wa/wa-automate/dist/api/model/group-metadata.js";
export const client = new Client({
  authTimeout: 0,
  qrTimeout: 0,
  multiDevice: true,
  popup: true,
  licenseKey: settings.Lisences,
  useChrome: settings.useChrome || false,
}, {
  mongoUrl: settings.MongoURL,
});

export const uptime = new Date();

client.setSecret(process.env.Secret as string || "").start().then((clientInstance)=>{
  
  clientInstance.onAnyMessage((msg)=>{
    try {
      client.handleCommand(msg);
    } catch (error) {
      if (error instanceof Error) {
        client.logger(`Error founded on ${msg.body} ${error.message}`, "ERROR DETECTED");
      }
    }
  });
});

