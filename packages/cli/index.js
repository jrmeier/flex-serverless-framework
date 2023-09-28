import { Command } from 'commander';
import { newService } from './newService.js';

const program = new Command();

program.addCommand(newService);

program.parse(process.argv);