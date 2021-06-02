#!/usr/bin/env bash

sqlite3 ./dist/data.sqlite "SELECT code,name FROM province ORDER BY code;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2 }
   END {
      printf "[";
      for(j=1;j<=i;j++){
         printf "{|code|:|%s|,|name|:|%s|",code[j],name[j]
         closing="},"
         if(j==i){closing="}"}
         printf closing;
      }
      printf "]";
   }' | tr '|' '"' > ./dist/provinces.json

sqlite3 ./dist/data.sqlite "SELECT code,name,provinceCode FROM city ORDER BY code;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; provinceCode[i]=$3 }
   END {
      printf "[";
      for(j=1;j<=i;j++){
         printf "{|code|:|%s|,|name|:|%s|,|provinceCode|:|%s|",code[j],name[j],provinceCode[j]
         closing="},"
         if(j==i){closing="}"}
         printf closing;
      }
      printf "]";
   }' | tr '|' '"' > ./dist/cities.json

sqlite3 ./dist/data.sqlite "SELECT code,name,cityCode,provinceCode FROM area ORDER BY code;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; cityCode[i]=$3; provinceCode[i]=$4 }
   END {
      printf "[";
      for(j=1;j<=i;j++){
         printf "{|code|:|%s|,|name|:|%s|,|cityCode|:|%s|,|provinceCode|:|%s|",code[j],name[j],cityCode[j],provinceCode[j]
         closing="},"
         if(j==i){closing="}"}
         printf closing;
      }
      printf "]";
   }' | tr '|' '"' > ./dist/areas.json

sqlite3 ./dist/data.sqlite "SELECT code,name,areaCode,cityCode,provinceCode FROM street ORDER BY code;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; areaCode[i]=$3; cityCode[i]=$4; provinceCode[i]=$5 }
   END {
      printf "[";
      for(j=1;j<=i;j++){
         printf "{|code|:|%s|,|name|:|%s|,|areaCode|:|%s|,|cityCode|:|%s|,|provinceCode|:|%s|",code[j],name[j],areaCode[j],cityCode[j],provinceCode[j]
         closing="},"
         if(j==i){closing="}"}
         printf closing;
      }
      printf "]";
   }' | tr '|' '"' > ./dist/streets.json

sqlite3 ./dist/data.sqlite "SELECT code,name,type,streetCode,areaCode,cityCode,provinceCode FROM village ORDER BY code;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; type[i]=$3; streetCode[i]=$4; areaCode[i]=$5; cityCode[i]=$6; provinceCode[i]=$7 }
   END {
      printf "[";
      for(j=1;j<=i;j++){
         printf "{|code|:|%s|,|name|:|%s|,|type|:|%s|,|streetCode|:|%s|,|areaCode|:|%s|,|cityCode|:|%s|,|provinceCode|:|%s|",code[j],name[j],type[j],streetCode[j],areaCode[j],cityCode[j],provinceCode[j]
         closing="},"
         if(j==i){closing="}"}
         printf closing;
      }
      printf "]";
   }' | tr '|' '"' > ./dist/villages.json
