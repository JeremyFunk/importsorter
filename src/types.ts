export interface ImportLine{
	lines: string[]
	origin: string
	import: string
}

export interface ImportRule{
	ruleType: "RegEx" | "StartsWith" | "EndsWith" | "Includes" | 'Equals'
	originOperatorAnd?: boolean
	originMatches: string[]
	importOperatorAnd?: boolean
	importMatches?: string[]
}

export interface ImportRuleRaw{
	ruleType: "RegEx" | "StartsWith" | "EndsWith" | "Includes" | 'Equals'
	originOperatorAnd?: boolean
	originMatches: string[]
	importOperatorAnd?: boolean
	importMatches?: string[]
}

export interface Configuration{
	rules: ImportRuleRaw[]
}
