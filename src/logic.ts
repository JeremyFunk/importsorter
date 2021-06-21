import * as vscode from 'vscode';
import { loadData } from './helpers/configManager';
import { errorCouldNotLoadData, errorEmptyData, errorNoEditor } from './helpers/errorHandler';
import { getImport, getOrigin, isClosingImport } from './helpers/helpers';
import { ImportLine, ImportRule} from './types'

export const setupCommand = (): ImportRule[] | undefined => {
    const editor = vscode.window.activeTextEditor;
    if(editor){
        const importRules = loadData()
        if(!importRules){
            errorCouldNotLoadData()
        }
        if(importRules?.length == 0){
            errorEmptyData()
        }
        
        console.log("Setup complete")
        return importRules
    }else{
        errorNoEditor()
        return undefined
    }
}

//Converts the lines into an array of imports and other code
export const getLines = (): {lines: ImportLine[], otherCode: string} | undefined => {
    const editor = vscode.window.activeTextEditor;
    if(!editor){
        return undefined
    }
    
    //Lines that contain an import
    const lines: ImportLine[] = []
	
    //Used to follow multiline imports
    let openLines: string[] = []
    //All code that is not an import
    let otherCode: string = ''

    const document = editor.document;

    //For all lines in the document
    for(let i = 0; i < document.lineCount; i++){
        const currentLine = document.lineAt(i).text;
        const currentLineTrimmed = document.lineAt(i).text.trim();

        //If there is an ongoing multiline import
        if(openLines.length != 0){

            if(!isClosingImport(currentLineTrimmed)){
                openLines.push(currentLine)
            }else{
                openLines.push(currentLineTrimmed)
                lines.push({lines: openLines, import: getImport(openLines.join(' ')), origin: getOrigin(openLines.join(' '))})
                openLines = []
            }
        }else{
            if(currentLineTrimmed.startsWith('import')){
                if(!isClosingImport(currentLineTrimmed)){
                    openLines.push(currentLineTrimmed)
                }else{
                    openLines = []
                    lines.push({lines: [currentLineTrimmed], import: getImport(currentLineTrimmed), origin: getOrigin(currentLineTrimmed)})
                }
            }else{
                otherCode += currentLine + "\n"
            }
        }
    }
    return {lines: lines, otherCode: otherCode}
}


export const convertLines = (lines: ImportLine[], importRules: ImportRule[]): string[] => {
    const sortedImportLines: string[] = []

    //Keeps track of whether a rule was found in any of the lines
    let foundRule = false
    //All lines that matched a rule. Used to avoid double-matching or none-matching lines.
    const matchedLines: number[] = []
    importRules.forEach(rule =>{
        foundRule = false
        
        lines.forEach((line, index) => {
            //If this line was already matchd by some rule
            if(matchedLines.some(line => index == line))
                return

            //Whether line matched rule
            let matched = match(rule, line)

            if(matched){
                //A line for this rule was found
                foundRule = true
                //Add this line(s) to the sorted imports
                sortedImportLines.push(...line.lines)
                //Add this line into matchedLines
                matchedLines.push(index)
            }
        })

        //If rule was found add a new empty line as space
        if(foundRule){
            sortedImportLines.push('')
        }
    })

    //Add all lines that were matchede by no rule at the end of the imports
    lines.forEach((line, index) => {
        if(matchedLines.some(line => index == line))
            return
        sortedImportLines.push(...line.lines)
    })

    return sortedImportLines
}


const match = (rule: ImportRule, line: ImportLine): boolean => {

    const matchPred = (rule: ImportRule, line: ImportLine, predicate: (rule: string) => boolean): boolean => {
        if(rule.originOperatorAnd){
            return rule.originMatches.every(originRule => predicate(originRule))
        }else{
            return rule.originMatches.some(originRule => predicate(originRule))
        }
    }
    console.log("got",rule.ruleType)
    switch(rule.ruleType){
        case 'Includes':
            return matchPred(rule, line, (rule) => line.origin.includes(rule))
        case 'EndsWith':
            return matchPred(rule, line, (rule) => line.origin.endsWith(rule))
        case 'StartsWith':
            return matchPred(rule, line, (rule) => line.origin.startsWith(rule))
        case 'RegEx':
            return matchPred(rule, line, (rule) => {
                const match = line.origin.match(rule)
                console.log(match)
                return (match?.length || 0) > 0
            })
        case 'Equals':
            return matchPred(rule, line, (rule) => line.origin === rule)
    }
}

export const constructCode = (sortedImportLines: string[], otherCode: string): string => {
    let importText = ''
    sortedImportLines.forEach(line => importText += line + '\n')
    return importText + '\n' + otherCode.trim()
}

export const writeCode = (code: string) => {
    const editor = vscode.window.activeTextEditor;
    editor?.edit(e => {
        const lastChar = editor.document.lineAt(editor.document.lineCount - 1).text.length
        e.replace(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(editor.document.lineCount, lastChar < 0 ? 0 : lastChar)), code )
    })
}
