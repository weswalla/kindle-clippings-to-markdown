const clippings = require('./store/books.json')

let titles = Object.keys(clippings)

let randomIndex = Math.floor(Math.random() * titles.length)

let highlights = clippings[titles[randomIndex]].highlights
let highlightLocations = Object.keys(highlights)
let randomIndex2 = Math.floor(Math.random() * highlightLocations.length)
let output = highlights[highlightLocations[randomIndex2]]
console.log(titles[randomIndex])
console.log(output)
