#!/bin/bash
./fetch_kindle_clippings.sh
node parse-books.js
node combine-highlights-and-notes.js books
node combine-highlights-and-notes.js articles
node sort-articles.js
node books-to-markdown.js
node articles-to-markdown.js
