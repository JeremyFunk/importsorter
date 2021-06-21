export interface ImportLine{
	lines: string[]
	origin: string
	import: string
}

export interface ImportRule{
	originOperatorAnd?: boolean
	originMatches: RegExp[]
	importOperatorAnd?: boolean
	importMatches?: RegExp[]
}

export interface ImportRuleRaw{
	originOperatorAnd?: boolean
	originMatches: string[]
	importOperatorAnd?: boolean
	importMatches?: string[]
}

export interface Configuration{
	rules: ImportRuleRaw[]
}
