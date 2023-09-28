const { Command, Argument, Option} = require('commander');
import { newServiceAction } from './newServiceAction.js';

export const newProject = new Command('new-service')
.description('create a new project and with all the basics')
.addArgument(new Argument('name','name of the project').argRequired())
.action(newServiceAction)
.addHelpCommand()
