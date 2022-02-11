const fs = require('fs')
const path = require('path')
const { outputDir } = require('./config.json')
const NEXTCLIP = '\r\n\n---\r\n\n'
const combined = require('./store/books-combined.json')


for (const title in combined) {
    let markdownContents = ''
    let bookHighlights = combined[title]
    // order the bookhighlights
    let clipLocations = Object.keys(bookHighlights)
    clipLocations.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    for (const location of clipLocations) {
        if(location in bookHighlights) {
            let pageNumber = ''
            if(bookHighlights[location].page) {
                pageNumber = ` p.${bookHighlights[location].page}`
            }
            markdownContents = markdownContents + bookHighlights[location].content + `(loc.${location}` + pageNumber + ')' + NEXTCLIP
        }
    }
    fs.writeFileSync(path.join(outputDir, `/books/${title}.md`), markdownContents, 'utf8')
}
