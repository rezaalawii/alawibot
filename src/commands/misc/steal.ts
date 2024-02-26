import {decryptMedia, Message} from "@open-wa/wa-automate";
import {extension} from "mime-types";
import {Client} from "../../util/extend/Client";

export async function run(client:Client, message:Message) {
  const {isMedia, mimetype, quotedMsg} = message;
  const isQuotedImage = quotedMsg && (quotedMsg.type === "video" || quotedMsg.type === "image");

  if (isMedia || isQuotedImage) {
    const encryptMedia = isQuotedImage ? quotedMsg : message;
    const _mimetype = isQuotedImage ? quotedMsg!.mimetype : mimetype;
    const mediaData = await decryptMedia(encryptMedia as Message);
    const imageBase64 = `data:${_mimetype};base64,${mediaData.toString("base64")}`;
    await client.clientInstances?.sendImage(message.chatId, imageBase64, `video.${extension(_mimetype as string)}`, "ini hasilnya kak!");
  } else {
    client.clientInstances!.sendText(message.chatId, "no media");
  }
}

export const name = "steal";
export const description = "Steal something from somewhere";