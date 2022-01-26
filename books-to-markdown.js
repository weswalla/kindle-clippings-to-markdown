const fs = require('fs')
const path = require('path')
const books = require('./store/books.json')
const { outputDir } = require('./config.json')
const NEXTCLIP = '\r\n\n---\r\n\n'

for (const title in books) {
    let markdownContents = ''
    let bookHighlights = books[title].highlights
    let bookNotes = books[title].notes
    for (const noteLocation in bookNotes) {
        if(noteLocation in bookHighlights) {
            bookHighlights[noteLocation].content = bookHighlights[noteLocation].content + '\r\n\r\nNOTE:\r\n' + bookNotes[noteLocation].content
        }
        else {
            bookNotes[noteLocation].content = 'NOTE:\r\n' + bookNotes[noteLocation].content
            bookHighlights[noteLocation] = bookNotes[noteLocation]
        }
    }
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