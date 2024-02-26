import { decryptMedia } from "@open-wa/wa-automate";
import { extension } from "mime-types";
export async function run(client, message) {
    const { isMedia, mimetype, quotedMsg } = message;
    const isQuotedImage = quotedMsg && (quotedMsg.type === "video" || quotedMsg.type === "image");
    if (isMedia || isQuotedImage) {
        const encryptMedia = isQuotedImage ? quotedMsg : message;
        const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype;
        const mediaData = await decryptMedia(encryptMedia);
        const imageBase64 = `data:${_mimetype};base64,${mediaData.toString("base64")}`;
        await client.clientInstances?.sendImage(message.chatId, imageBase64, `video.${extension(_mimetype)}`, "ini hasilnya kak!");
    }
    else {
        client.clientInstances.sendText(message.chatId, "no media");
    }
}
export const name = "steal";
export const description = "Steal something from somewhere";
