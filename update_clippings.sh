#!/bin/bash
./fetch_kindle_clippings.sh
node parse-books.js
node books-to-markdown.js