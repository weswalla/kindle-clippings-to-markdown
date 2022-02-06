const fs = require('fs')
const path = require('path')
const { outputDir } = require('./config.json')
const NEXTCLIP = '\r\n\n---\r\n\n'
const NOTEINDICATOR = '\r\n\r\nNOTE:\r\n'
const combined = require('./store/articles-combined.json')

let formattedArticles = {}
for (const title in combined) {
    formattedArticles[title] = {}
    let markdownContents = ''
    let bookHighlights = combined[title]
    // order the bookhighlights
    let clipLocations = Object.keys(bookHighlights)
    clipLocations.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

    let prevLocation = null
    let prevTitle = 'no title'
    let currTitleLocation = null
    let currTitle = 'no title'
    formattedArticles[title][currTitle] = {}
    for (const location of clipLocations) {
        // this loops through in order, check here for article title
        if(location in bookHighlights) {
            //check if containts '.Title.'
            if(bookHighlights[location].content.includes('.Title.') && !bookHighlights[location].content.startsWith('NOTE:')) {
                //content is a title
                // track current title location
                currTitle = bookHighlights[location].content.split(NOTEINDICATOR)[0]
                formattedArticles[title][currTitle] = {}
                formattedArticles[title][currTitle][location] = bookHighlights[location]
                prevTitle = currTitle
            }
            else if(bookHighlights[location].content.includes('.Title.') && bookHighlights[location].content.startsWith('NOTE:')) {
                // handling if no title
                if (prevTitle === 'no title' && Object.keys(formattedArticles[title][prevTitle]).length <= 1) {
                    delete formattedArticles[title][prevTitle]
                } 
                currTitle = bookHighlights[prevLocation].content
                formattedArticles[title][currTitle] = {}
                formattedArticles[title][currTitle][location] = bookHighlights[location]
                prevTitle = currTitle
            }
            else {
                // add note to current article
                formattedArticles[title][currTitle][location] = bookHighlights[location]
            }
            prevLocation = location
        }
    }
}
fs.writeFileSync('./store/formatted-articles.json', JSON.stringify(formattedArticles), 'utf8')
// check if 'no title' has anything in it, if empty, delete
// handle situation where the title is in the no title section

for (const title in formattedArticles) {
    console.log('INSTAPAPER',title)
    for (const articleName in formattedArticles[title]) {
        console.log(articleName)
    }
}