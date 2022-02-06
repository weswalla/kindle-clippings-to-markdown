const fs = require('fs')
const path = require('path')
// const { outputDir } = require('./config.json')
const outputDir = './test/'
const NEXTCLIP = '\r\n\n---\r\n\n'
const formattedArticles = require('./store/formatted-articles.json')

// get the no title, then delete it from the object

if ('no title' in formattedArticles) {
    let markdownContents = ''
    let bookHighlights = formattedArticles['no title']

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
    // delete the no title, then get keys and make as markdown links
    fs.writeFileSync(path.join(outputDir, `/instapaper/${title}.md`), markdownContents, 'utf8')
}
for (const title in formattedArticles) {

    if ('no title' in formattedArticles[title]) {
        let markdownContents = ''
        let bookHighlights = formattedArticles[title]['no title']

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
        // delete the no title, then get keys and make as markdown links
        fs.writeFileSync(path.join(outputDir, `/instapaper/${title}.md`), markdownContents, 'utf8')
    }

    //loop through each article from each instapaper book
    for (const article in formattedArticles[title]) {
        if(article !== 'no title') {
            let markdownContents = ''
            let bookHighlights = formattedArticles[title][article]
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
            fs.writeFileSync(path.join(outputDir, `/articles/${article}.md`), markdownContents, 'utf8')
        }
    }
}