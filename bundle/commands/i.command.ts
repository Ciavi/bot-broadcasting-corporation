import { CacheType, Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface ICommand {
    client: Client;
    command: SlashCommandBuilder;
}

export abstract class Command implements ICommand {
    public client: Client;
    public command!: SlashCommandBuilder;

    constructor(client: Client) {
        this.client = client;
    }

    public abstract run(interaction: CommandInteraction<CacheType>): Promise<void>;
}