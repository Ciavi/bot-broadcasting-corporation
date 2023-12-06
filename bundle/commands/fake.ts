import { CacheType, Client, CommandInteraction, SlashCommandBuilder, SlashCommandStringOption } from "discord.js";
import ICommand, { Command } from "./i.command";

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
                    .setMaxLength(40)
            )
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("subtitle")
                    .setDescription("The subtitle")
                    .setRequired(true)
                    .setMaxLength(48)
            )
            .addStringOption(
                new SlashCommandStringOption()
                    .setName("excerpt")
                    .setDescription("The excerpt")
                    .setRequired(true)
                    .setMaxLength(54)
            )
            .setName("fake")
            .setDescription("Generate fake news using a BBC-inspired mask")
            .setNSFW(true);
    }

    public async run(interaction: CommandInteraction<CacheType>) {
        /**
         * To-Do
         */
    }
}