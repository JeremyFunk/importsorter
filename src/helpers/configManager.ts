import { Configuration, ImportRule } from "../types"
import * as vscode from 'vscode';
import * as fs from 'fs';
import {print} from './logger'

const configPrefix = 'importSorter'

/**
 *  Loads the data from config files.
 * 
 * @returns boolean : true = successful
 */
 export const loadData = (): ImportRule[] | undefined => {
    try{
        let data: Configuration = getDataByConfigFile() || getDataByConfigPath() || getDataByConfigData()

        if(!data.rules)
            return undefined

        const importRules: ImportRule[] = data.rules.map(rule => {
            return {
                originMatches: rule.originMatches.map(r => new RegExp(r)),
                importMatches: rule.importMatches?.map(r => new RegExp(r)),
                importOperatorAnd: rule.importOperatorAnd || false,
                originOperatorAnd: rule.originOperatorAnd || false
            }
        })
        importRules.push({originMatches: [new RegExp(`(?:^|')./`)]})

        console.log('loaded data')
        return importRules
    }catch(e){
        print(e)
        return undefined
    }
}


const getDataByConfigData = (): Configuration => {
    const res = vscode.workspace.getConfiguration('importSorter').get('defaultSortingOptions') as Configuration
    console.log("Using config data")
    return res
}

const getDataByConfigPath = (): Configuration | undefined => {
    const path = vscode.workspace.getConfiguration(configPrefix).get('configurationFile')
    if(path){
        try{
            const res = require(path as string) as Configuration
            print("Using config path")
            return res
        }catch(e){
            return undefined
        }
    }
    return undefined
}



const getDataByConfigFile = (): Configuration | undefined => {
    const folders = vscode.workspace.workspaceFolders
    if(folders && folders.length > 0){
        const path = `${folders[0].uri.fsPath}\\${configPrefix}.json`
        
        if(fs.existsSync(path)){
            try{
                const res = require(path) as Configuration
                print("Using config file")
                return res 
            }catch(er){
                print(er)
            }
        }
    }
}
