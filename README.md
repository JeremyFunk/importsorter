# importsorter README

Import sorter V0.0.3 version. 

## Features

The user can define a custom, detailed sorting system. Use "Sort Imports" command (`CTRL + Shift + P -> SortImports`) to sort imports. 

The user defines how imports are sorted via string operations or Regular Expressions.
Currently no default sorting option is provided, the user has to define how to sort.

The configuraiton can be provided in three ways. 
1. The extension looks for a file called `import-sorter.json` in the root directory of your workspace. 
2. If the file above does not exist, the extension will use the file path defined in the settings (`importSorter.configurationFile`)
3. If neither the file in the root directory, nor the path in the configuration is defined, the extension will use the configuration defined directly in the settings (`importSorter.defaultSortingOptions`)

## Configuration Format

The configuration has to be provided in the following format:

```json
"Rules": [
    {
        "originMatches": string[],
        "ruleType": "RegEx" | "StartsWith" | "EndsWith" | "Includes" | "Equals"
    }
]
```

One example for a valid configuration:

```json
"rules": [ 
    {
        "originMatches": [
            "react"
        ],
        "ruleType": "Equals"
    },
    {
        "originMatches": [
            "react",
            "clsx",
            "next"
        ],
        "ruleType": "Includes"
    },
    {
        "originMatches": [
            "@material-ui"
        ],
        "ruleType": "StartsWith"
    },
    {
        "originMatches": [
            "(?:^|')./"
        ],
        "ruleType": "RegEx"
    }
]
```

## Requirements

No requirements.

## Extension Settings

This extension contributes the following settings:

* `importSorter.configurationFile`: a path to a configuration file
* `importSorter.defaultSortingOptions`: if no configuration file is provided, the default options will be used. 

## Release Notes


### 0.0.1 Alpha

Initial release of ImportSorter.
### 0.0.3 Alpha

Updated Readme