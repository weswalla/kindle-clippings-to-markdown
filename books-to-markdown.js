const books = require('./books.json')

for (const title in books) {
    console.log(title)
}