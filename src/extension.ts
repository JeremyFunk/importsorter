/* eslint-disable @typescript-eslint/semi */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { constructCode, convertLines, getLines, setupCommand, writeCode } from './logic';
import { ImportRule } from './types';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('importsorter.sortImports', () => {
		console.log("Soting imports")
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
			
		//Get a list of rules
		let importRules: ImportRule[] | undefined = setupCommand()
		if(!importRules){
			return
		}

		console.log("Imported rules")
		//Get the lines of imports and other code
		const potentialLines = getLines()
		if(!potentialLines)
			return

		let {lines, otherCode} = potentialLines
		console.log("Got lines")

		//Convert imports into a the list of sorted imports as a string array
		const sortedImportLines = convertLines(lines, importRules)
		console.log("Sorted Lines")
		//Reconstruct code
		const code = constructCode(sortedImportLines, otherCode)
		console.log("Constructed Code")
		//Write to editor
		writeCode(code)
		console.log("Complete")
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}













const test = `import React, { FC, ReactElement } from 'react'
import clsx from 'clsx'

import { Box, Typography } from '@material-ui/core'

import { RankImage } from '../../atoms'
import { WinrateProgressBar } from '../../molecules'

import { calculateWinrate } from '../../../lib/helpers/league.helpers'

import { EloProfileProps } from './EloProfile.types'
import { useEloProfileStyles } from './EloProfile.styles'


import Head from 'next/head'
import type { AppProps } from 'next/app'

import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'

import { ReactQueryDevtools } from 'react-query/devtools'

import { CssBaseline, ThemeProvider } from '@material-ui/core'

import { theme } from '../lib/theme'
import { MainLayout } from '../layouts'




import {HeatMap,ProfileIconWithUsername,} from '../../../../components/organisms'
import { Card } from '../../../../components/atoms'
import { Container } from 'next/app'
import { useRouter } from 'next/router'
import { getRegexForSummonerName } from '../../../../lib/helpers/generic.helpers'
import { shiftDate } from '../../../../lib/helpers/time.helper'
import { useUserQuery } from '../../../../lib/types/gql/generated'
import { Ranks } from '../../../../lib/types/genericTypes'


import { PostMatchTableProps } from './PostMatchTable.types'
import { usePostMatchTableStyles } from './PostMatchTable.styles'
import PostMatchSummoner from '../../molecules/PostMatchSummoner'


const EloProfile: FC<EloProfileProps> = ({
	elo,
	lp,
	division,
	queueType,
	wins,
	loses,
	className,
}): ReactElement => {
	const classes = useEloProfileStyles()

	return (
		<Box className={clsx(classes.root, className)} component={'a'}>
			<Box
				display='flex'
				justifyContent='center'
				alignItems='center'
				marginRight={'1rem'}
			>
				<RankImage
					width='64px'
					height='64px'
					rank={elo}
					division={division}
				></RankImage>
			</Box>
			<Box display='flex' flexDirection='column' width='100%'>
				<Box className={classes.rankedStats}>
					<Box>
						<Typography
							variant='h6'
							color='textPrimary'
							style={{ fontWeight: 'bold' }}
						>
							{elo !== 'UNRANKED'
								?
								\${elo} \${division} \${lp}LP'
								: 'UNRANKED'}
						</Typography>
						<Typography
							component={'span'}
							variant='subtitle1'
							style={{ fontWeight: 'bold' }}
						>
							{'\${wins} W \${loses} L'}
						</Typography>
						<Typography
							component={'span'}
							color={'textSecondary'}
							style={{ fontWeight: 'bold' }}
						>
							{' '}
							·{' '}
						</Typography>
						<Typography component={'span'} color={'textSecondary'}>
							{'\${calculateWinrate(wins, loses) || '0'}%'}
						</Typography>
					</Box>
					<Box>
						<Typography
							variant='h6'
							align='right'
							color={'textPrimary'}
							style={{ fontWeight: 'bold' }}
						>
							{'\${queueType}'}
						</Typography>
					</Box>
				</Box>
				<WinrateProgressBar
					variant='determinate'
					value={calculateWinrate(wins, loses)}
				/>
			</Box>
		</Box>
	)
}

export default EloProfile
`