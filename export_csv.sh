#!/usr/bin/env bash

sqlite3 -header -csv ./dist/data.sqlite 'SELECT * FROM province ORDER BY code;' > ./dist/provinces.csv
sqlite3 -header -csv ./dist/data.sqlite 'SELECT * FROM city ORDER BY code;' > ./dist/cities.csv
sqlite3 -header -csv ./dist/data.sqlite 'SELECT * FROM area ORDER BY code;' > ./dist/areas.csv
sqlite3 -header -csv ./dist/data.sqlite 'SELECT * FROM street ORDER BY code;' > ./dist/streets.csv
sqlite3 -header -csv ./dist/data.sqlite 'SELECT * FROM village ORDER BY code;' > ./dist/villages.csv
