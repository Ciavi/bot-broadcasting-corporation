import fs from "fs";
import https from "https";
import sharp from "sharp";
import util from "util";
import Logger from "./logging";

const unlinkAsync = util.promisify(fs.unlink);

export default class Imaging {
    public static async download(uri: string): Promise<Buffer> {
        return Buffer.from(await (await fetch(uri)).arrayBuffer());
    }

    public static async overlay(bottom: Buffer, top: Buffer): Promise<Buffer> {
        return await sharp(bottom).composite([ { input: top, blend: "over" } ]).toBuffer();
    }

    public static async rasterize(vector: Buffer, path: string, size: { width: number, height: number }): Promise<Buffer> {
        return await sharp(vector, { density: 300 }).resize(size.width, size.height).toFormat("png").toBuffer();
    }

    public static replace(vector: Buffer, needle: string, replacement: string): Buffer {
        let content = vector.toString("utf-8");
        content = content.replace(needle, replacement);

        return Buffer.from(content, "utf-8");
    }

    public static async resize(image: Buffer, size: { width: number, height: number }): Promise<Buffer> {
        return await sharp(image).resize(size.width, size.height).toBuffer();
    }
}