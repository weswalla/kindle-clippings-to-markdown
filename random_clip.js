let isBook
if(process.argv.length === 2) {
    isBook = Math.floor(Math.random() * 2)
}
else if (process.argv[2] === 'book') {
    isBook = 1
}
else if (process.argv[2] === 'article') {
    isBook = 0
}

else {
    isBook = Math.floor(Math.random() * 2)
}

if(isBook) {
    const clippings = require('./store/books-combined.json')
    let titles = Object.keys(clippings)
    let randomIndex = Math.floor(Math.random() * titles.length)
    let highlights = clippings[titles[randomIndex]]
    printRandomHighlight(titles[randomIndex], highlights)
}
else {
    const clippings = require('./store/formatted-articles.json')
    let titles = Object.keys(clippings)
    
    let randomIndex = Math.floor(Math.random() * titles.length)
    
    let instapaperDigest = clippings[titles[randomIndex]]
    let articles = Object.keys(instapaperDigest)
    let randomArticleIndex = Math.floor(Math.random() * articles.length)
    let highlights = instapaperDigest[articles[randomArticleIndex]]
    printRandomHighlight(articles[randomArticleIndex], highlights)
}
function printRandomHighlight(title, highlights) {
    let highlightLocations = Object.keys(highlights)
    let randomIndex2 = Math.floor(Math.random() * highlightLocations.length)
    let output = highlights[highlightLocations[randomIndex2]]
    console.log(title)
    if(output.content.startsWith('NOTE:')) {
        console.log(highlights[highlightLocations[randomIndex2 - 1]].content)
        console.log(output.content)
    }
    else if(output.content.includes('NOTE:')) {
        console.log(output.content)
    }
    else {
        console.log(output.content)
        if(randomIndex2 < highlightLocations.length - 1) {
            if(highlights[highlightLocations[randomIndex2 + 1]].content.startsWith('NOTE:')) {
                console.log(highlights[highlightLocations[randomIndex2 + 1]].content)
            }
        }
    }
}