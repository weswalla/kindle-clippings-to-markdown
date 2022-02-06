const fs = require('fs')
const path = require('path')
const { outputDir } = require('./config.json')
const NEXTCLIP = '\r\n\n---\r\n\n'

let type = process.argv[2]

const books = require(`./store/${type}.json`)

function combineNotesWithHighlights(books) {
    let combined = {}
    for (const title in books) {
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
        combined[title] = bookHighlights
    }
    return combined
}

let combined = combineNotesWithHighlights(books)

fs.writeFileSync(`./store/${type}-combined.json`, JSON.stringify(combined), 'utf8')