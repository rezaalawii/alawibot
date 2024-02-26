import "dotenv/config";
export const prefix = process.env.DEV ? "dev#" : "!";
export const useChrome = true;
export const Lisences = process.env.Lisences;
export const MongoURL = process.env.MongoURL;
