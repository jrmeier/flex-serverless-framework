import { toSnakeCase } from "@flex/utils/toCamelCase"
import fs from 'fs'

// TODO: 
PROJECT_ROOT = '~/Projects'

export const newProjectAction = async (projectName, options) => {
    // create the new project diectory
    const projectNameSnake = toSnakeCase(projectName)
    // TODO: this sucks

    if(!fs.existsSync(`~/Projects/${projectNameSnake}`)){
        fs.mkdirSync(projPath)
    }

    // create the new project files
    
}
