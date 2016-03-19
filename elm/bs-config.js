'use strict'
const style = `
<link rel='stylesheet' href='assets/css/main.css'>
<link rel='stylesheet' href='assets/css/debug.css'>
`

module.exports =
{ files: [ '*.elm', 'assets/css/*.css' ]
, proxy: "localhost:8000"
, snippetOptions:
  {
    // Provide a custom Regex for inserting the snippet.
    rule:
    { match: /<\/head>.*<body>/i
    , fn ( snippet, match ) {
        return style + match + snippet
      }
    }
  }
}
