const { Command, Argument, Option} = require('commander');
import { newServiceAction } from './newServiceAction.js';
export const newService = new Command('new-service')
.description('creates a new service directory with the basic files')
.addArgument(new Argument('name','name of the service you want to generate').argRequired())
.addOption(new Option("-e, --event", 'is this a service that will be triggered by an event for http').default(false))
.addOption(new Option("-m, --method", 'HTTP methods GET, POST, PUT, DELETE').default('GET'))
.addOption(new Option("-p, --private", 'if the route should be private').default(true))
.action(newServiceAction)
.addHelpCommand()
