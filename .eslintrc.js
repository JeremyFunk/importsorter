module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
	},
	plugins: ['react', '@typescript-eslint', 'unused-imports'],
	rules: {
		'@typescript-eslint/await-thenable': 'error',
		'@typescript-eslint/array-type': 'error',
		'no-var': 'error',
		'no-console': 'warn',
		'@typescript-eslint/no-explicit-any': 'error',
		'sort-imports': [
			'error',
			{
				ignoreDeclarationSort: true,
			},
		],
		'unused-imports/no-unused-imports': 'error',
	},
}
