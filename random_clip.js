const clippings = require('./store/combined.json')

let titles = Object.keys(clippings)

let randomIndex = Math.floor(Math.random() * titles.length)

let highlights = clippings[titles[randomIndex]]
let highlightLocations = Object.keys(highlights)
let randomIndex2 = Math.floor(Math.random() * highlightLocations.length)
let output = highlights[highlightLocations[randomIndex2]]
// check if starts with NOTE:, if does include the note before.
// if doesnt check if it contains NOTE: somewhere in it, if not, check next one if starts with NOTE
// print both if does, otherwise print just the original one
console.log(titles[randomIndex])
if(output.content.startsWith('NOTE:')) {
    console.log(highlights[highlightLocations[randomIndex2 - 1]])
    console.log(output)
}
else if(output.content.includes('NOTE:')) {
    console.log(output)
}
else {
    console.log(output)
    if(randomIndex2 < highlightLocations.length - 1) {
        if(highlights[highlightLocations[randomIndex2 + 1]].content.startsWith('NOTE:')) {
            console.log(highlights[highlightLocations[randomIndex2 + 1]])
        }
    }
}
