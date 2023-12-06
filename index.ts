import { CacheType, Client, Events, GatewayIntentBits, Interaction, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, SlashCommandBuilder } from "discord.js";
import * as env from "dotenv";
import Logger from "./bundle/logging";
import { Command } from "./bundle/commands/i.command";
import HelpCommand from "./bundle/commands/help";
import FakeCommand from "./bundle/commands/fake";

env.config();

class Bot {
    public client: Client;
    public commands: Command[];
    public logger: Logger;
    public rest: REST;

    constructor(TOKEN: string | undefined = process.env.TOKEN, INTENTS: number = GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent) {
        this.logger = new Logger();
        this.rest = new REST().setToken(TOKEN!);
        
        this.logger.debug(`Initialising client with intents: ${INTENTS}`);
        this.client = new Client({ intents: INTENTS });

        this.logger.debug(`Registering client events`);
        this.registerEvents();

        this.commands = [];

        this.logger.debug(`Logging in...`);
        this.client.login(TOKEN);
    }

    public registerEvents() {
        this.client.on(Events.Debug, (log) => this.logger.debug(log));
        this.logger.debug(`Events.Debug registered`);

        this.client.on(Events.Warn, (log) => this.logger.warn(log));
        this.logger.debug(`Events.Warn registered`);

        this.client.on(Events.Error, (error) => this.logger.error(error.message));
        this.logger.debug(`Events.Error registered`);

        this.client.once(Events.ClientReady, async (ready) => await this.onClientReady(ready));
        this.logger.debug(`Events.ClientReady registered`);

        this.client.on(Events.InteractionCreate, async (interaction) => await this.onInteractionCreated(interaction));
        this.logger.debug(`Events.InteractionCreate registered`);
    }

    public async registerCommands() {
        let help = new HelpCommand(this.client);
        let fake = new FakeCommand(this.client);

        this.logger.debug(`Registering command ${help.command.name}`);
        this.commands.push(help);
        this.logger.debug(`Registering command ${fake.command.name}`);
        this.commands.push(fake);
        
        let command_data: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
        this.commands.forEach((command) => command_data.push(command.command.toJSON()));

        try {
            await this.rest.put(
                Routes.applicationCommands(this.client.application!.id),
                { body: command_data }
            );

            this.logger.info(`Commands registered successfully`);
        } catch (error: any) {
            this.logger.error(error.message);
        }
    }

    public async onClientReady(client: Client<true>) {
        this.logger.info(`Client ${client.user.tag} is ready`);
        
        this.logger.info(`Registering commands...`);
        await this.registerCommands();
    }

    public async onInteractionCreated(interaction: Interaction<CacheType>) {
        this.logger.debug(`Interaction ${interaction.id} invoked`);
    
        if(interaction.isCommand()) {
            this.logger.debug(`Running command ${interaction.commandName}#${interaction.id}`);
            
            await this.commands.filter((c) => c.command.name == interaction.commandName).at(0)?.run(interaction);
        }
    }
}

new Bot();
