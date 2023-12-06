import { CacheType, Client, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import ICommand, { Command } from "./i.command";

export default class HelpCommand extends Command implements ICommand {
    public client!: Client;
    public command: SlashCommandBuilder;

    constructor(client: Client) {
        super(client);

        this.command = new SlashCommandBuilder()
            .setName("help")
            .setDescription("Provides a nice schema to help you use the bot");
    }

    public async run(interaction: CommandInteraction<CacheType>) {
        let embed = new EmbedBuilder()
            .setTitle("Help maybe has arrived!")
            .setDescription("Follow this **not-at-all** practical sample image to find out where the command options for /fake will be used")
            .addFields(
                { name: "", value: "" },
            );

        await interaction.reply({ embeds: [ embed ], ephemeral: true });
    }
}