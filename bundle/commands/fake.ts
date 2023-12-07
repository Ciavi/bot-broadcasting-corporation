import * as fs from "fs";
import * as util from "util";
import { CacheType, ChatInputCommandInteraction, Client, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import ICommand, { Command } from "./i.command";
import Imaging from "../helpers/imaging";

const readFileAsync = util.promisify(fs.readFile);

export default class FakeCommand extends Command implements ICommand {
    public client!: Client;
    public command: SlashCommandBuilder;

    constructor(client: Client) {
        super(client);

        this.command = new SlashCommandBuilder()
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("background")
                    .setDescription("A public, valid, direct image url")
                    .setRequired(true)
            )
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("title")
                    .setDescription("The news' title")
                    .setRequired(true)
            )
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("subtitle")
                    .setDescription("The subtitle")
                    .setRequired(true)
            )
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("excerpt")
                    .setDescription("The excerpt")
                    .setRequired(true)
            )
            .setName("fake")
            .setDescription("Generate fake news using a BBC-inspired mask")
            .setNSFW(true);
    }

    public async run(interaction: ChatInputCommandInteraction<CacheType>) {
        let date_time = new Date(Date.now());

        let background = interaction.options.getString("background", true);
        let title = interaction.options.getString("title", true);
        let subtitle = interaction.options.getString("subtitle", true);
        let excerpt = interaction.options.getString("excerpt", true);
        let time = `${date_time.getHours().toString().padStart(2, '0')}:${date_time.getMinutes().toString().padStart(2, '0')}`;

        let mask_buffer = Imaging.replace(await readFileAsync("mask.svg"), "[[title]]", title);
        mask_buffer = Imaging.replace(mask_buffer, "[[subtitle]]", subtitle);
        mask_buffer = Imaging.replace(mask_buffer, "[[excerpt]]", excerpt);
        mask_buffer = Imaging.replace(mask_buffer, "[[time]]", time);
        mask_buffer = await Imaging.rasterize(mask_buffer, "current_mask", { width: 1920, height: 1080 });

        let background_buffer = await Imaging.download(background);

        if(background_buffer != null && background_buffer != undefined) {
            background_buffer = await Imaging.resize(background_buffer, { width: 1920, height: 1080 });
            let final_buffer = await Imaging.overlay(background_buffer, mask_buffer);
    
            await interaction.reply({ files: [ final_buffer ] });
        }
    }
}