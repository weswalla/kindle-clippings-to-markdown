const fs = require('fs')
const path = require('path')

const CONFIG = 'config.json'
const CLIPPINGS = 'My Clippings.txt'
const BOUNDARY = '\r\n==========\r\n'
const NEWLINE = '\r\n'
const HIGHLIGHT = '- Your Highlight'
const NOTE = '- Your Note'

let clippingText
try {
    clippingText = fs.readFileSync(`./${CLIPPINGS}`, 'utf8')
}
catch (err) {
    console.log(err)
    process.exit(1)
}

let clips = clippingText.split(BOUNDARY)
let clippings = {}
for(let clip of clips) {
    let lines = clip.split(NEWLINE)
    if(lines.length !== 4) {
        // console.log(lines.length)
        continue
    }
    let title = lines[0]
    let metadata = checkClipType(lines[1])
    if(!metadata) continue // if null
    if(title.includes('Instapaper: ')) {
        // find date from metadata, add to title
        let yearRegex = /20\d\d/
        let result = metadata.time.match(yearRegex)
        if(result) {
            title = `${title} ${result[0]}`
        }
    }
    // process metadata
    let content = lines[3]
    if(metadata.isHighlight) {
        // this is done to avoid trying to access a key of an object that doesn't exist
        if(!clippings[title]){
            clippings[title] = {}
        }
        if(!clippings[title].highlights){
            clippings[title].highlights = {}
        }
        clippings[title].highlights[metadata.location] = {
            content: content,
            page: metadata.page,
            time: metadata.time,
        }
    }
    else {
        if(!clippings[title]){
            clippings[title] = {}
        }
        if(!clippings[title].notes){
            clippings[title].notes = {}
        }
        clippings[title].notes[metadata.location] = {
            content: content,
            page: metadata.page,
            time: metadata.time,
        }
    }
}
fs.writeFileSync('./store/clippings.json', JSON.stringify(clippings), 'utf8')

function checkClipType(clipMeta) {
    let isHighlight
    let regexPattern
    let location
    let pageRegex = /page (\d+)/
    let page = null
    if(clipMeta.includes(HIGHLIGHT)) {
        isHighlight = true
        // only take the first number in the range, may have to reconsider this at some point
        // regexPattern = /Location (\d+)-(\d+)/
        regexPattern = /Location (\d+)/
        let match = clipMeta.match(regexPattern) 
        if(!match) {
            // regexPattern = /page (\d+)-(\d+)/
            regexPattern = /page (\d+)/
            match = clipMeta.match(regexPattern)
            if(!match) return false // means there is no page or location info
        }
        // location = `${match[1]}-${match[2]}`
        location = match[1]
    }
    else if(clipMeta.includes(NOTE)) {
        isHighlight = false
        regexPattern = /Location (\d+)/
        let match = clipMeta.match(regexPattern) 
        location = match[1]
    }
    else {
        return false
    }
    let includesPage = clipMeta.match(pageRegex)
    if(includesPage) {
       page = includesPage[1] 
    }
    let dateIndex = clipMeta.indexOf('Added on ')
    let date = clipMeta.slice(dateIndex + 9)
    let result = {
        location: location,
        isHighlight: isHighlight,
        page: page,
        time: date,
    }
    return result
}
// filter out non-books, or irrelevant books
let unwantedRegex = /W\d+_R\d+/
let books = {}
let articles = {}
for (const title in clippings) {
    if(title.includes('Instapaper: ')) {
        articles[title] = clippings[title]
        continue
    }
    if(title.match(unwantedRegex)) continue
    if(title.includes('BASKAR-THESIS-2017')) continue
    if(title.includes('C#:')) continue
    books[title] = clippings[title]
}

fs.writeFileSync('./store/books.json', JSON.stringify(books), 'utf8')
fs.writeFileSync('./store/articles.json', JSON.stringify(articles), 'utf8')
