const fs = require('fs')
const path = require('path')
const { outputDir } = require('./config.json')
const NEXTCLIP = '\r\n\n---\r\n\n'
const formattedArticles = require('./store/formatted-articles.json')
const illegalCharacters = ['#', '<', '>', '%', '&', '{', '}', '/', '$', '!', ':', '@', '|', '=']

function orderAndFormatHighlights(bookHighlights) {
    let markdownContents = ''
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
    return markdownContents
}

function formatArticleTitle(originalTitle) {
    const titleRegex = /(.+) ((?:\S+\.\S+\.\S+|\S+\.\S+))/
    const regexMatch = originalTitle.match(titleRegex)
    let articleTitle
    let website
    if (regexMatch) {
        articleTitle = regexMatch[1]
        website = regexMatch[2]
    }
    else {
        console.log(originalTitle)
        articleTitle = originalTitle
        website = ''
    }
    // replace the illegal characters
    for (illegalCharacter of illegalCharacters) {
        articleTitle = articleTitle.replace(new RegExp(String.raw`${illegalCharacter}`, 'g'), "")
    }
    return { articleTitle, website }
}

for (const title in formattedArticles) {

    if ('no title' in formattedArticles[title]) {
        let bookHighlights = formattedArticles[title]['no title']
        let markdownContents = orderAndFormatHighlights(bookHighlights)
        // add markdown title links
        // let titleLinks = ''        
        // const articles = Object.keys(formattedArticles[title])
        // console.log(articles)
        // for (articleTitle of articles) {
        //     if(articleTitle !== 'no title') {
        //         const { formattedTitle } = formatArticleTitle(articleTitle)
        //         titleLinks = titleLinks + `\r\n[[${formattedTitle}]]`
        //     }
        // }
        // markdownContents = markdownContents + '\n' + titleLinks
        fs.writeFileSync(path.join(outputDir, `/instapaper/${title}.md`), markdownContents, 'utf8')
    }

    //loop through each article from each instapaper book
    for (const article in formattedArticles[title]) {
        if(article !== 'no title') {
            const { articleTitle, website } = formatArticleTitle(article)
            let bookHighlights = formattedArticles[title][article]
            let markdownContents = `[[${title}]]\r\nsource: ${website}` + NEXTCLIP + orderAndFormatHighlights(bookHighlights)
            fs.writeFileSync(path.join(outputDir, `/articles/${articleTitle}.md`), markdownContents, 'utf8')
        }
    }
}