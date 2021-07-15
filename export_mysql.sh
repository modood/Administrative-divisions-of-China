#!/usr/bin/env bash
# export to MySQL
sqlite3 ./dist/data.sqlite "SELECT code,name FROM province ORDER BY code ;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2 }
   END {
      tableName = "province"
      printf "DROP TABLE IF EXISTS `%s`; \n", tableName;
      printf "CREATE TABLE `%s` ( \n", tableName;
      printf "    `code` varchar(10)  NOT NULL COMMENT |编号|, \n";
      printf "    `name` varchar(50)  DEFAULT NULL COMMENT |名称|, \n";
      printf "     PRIMARY KEY (`code`) USING BTREE  \n";
      printf ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4  COMMENT=|省份|; \n";
      printf "INSERT INTO `%s`(`code`, `name`) VALUES \n ", tableName;
      for(j=1;j<=i;j++){
         printf "(|%s|,|%s|",code[j],name[j]
         closing="),\n"
         if(j==i){closing=");\n"}
         printf closing;
      }
   }' | tr '|' '"' > ./dist/MySQL-provinces.sql

sqlite3 ./dist/data.sqlite "SELECT code,name,provinceCode FROM city ORDER BY code ;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; provinceCode[i]=$3 }
   END {
      tableName = "city"
      printf "DROP TABLE IF EXISTS `%s`; \n", tableName;
      printf "CREATE TABLE `%s` ( \n", tableName;
      printf "    `code` varchar(10)  NOT NULL COMMENT |编号|, \n";
      printf "    `name` varchar(50)  DEFAULT NULL COMMENT |名称|, \n";
      printf "    `provinceCode` varchar(10)  DEFAULT NULL COMMENT |省份编码|, \n";
      printf "     PRIMARY KEY (`code`) USING BTREE,  \n";
      printf "     KEY `index_provinceCode` (`provinceCode`) USING BTREE  \n";
      printf ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4  COMMENT=|城市|; \n";
      printf "INSERT INTO `%s`(`code`, `name`, `provinceCode`) VALUES \n ", tableName;
      for(j=1;j<=i;j++){
         printf "(|%s|,|%s|,|%s|",code[j],name[j],provinceCode[j]
         closing="),\n"
         if(j==i){closing=");\n"}
         printf closing;
      }
   }' | tr '|' '"' > ./dist/MySQL-cities.sql

sqlite3 ./dist/data.sqlite "SELECT code,name,cityCode,provinceCode FROM area ORDER BY code;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; cityCode[i]=$3; provinceCode[i]=$4 }
   END {
      tableName = "area"
      printf "DROP TABLE IF EXISTS `%s`; \n", tableName;
      printf "CREATE TABLE `%s` ( \n", tableName;
      printf "    `code` varchar(10)  NOT NULL COMMENT |编号|, \n";
      printf "    `name` varchar(50)  DEFAULT NULL COMMENT |名称|, \n";
      printf "    `cityCode` varchar(10)  DEFAULT NULL COMMENT |城市编码|, \n";
      printf "    `provinceCode` varchar(10)  DEFAULT NULL COMMENT |省份编码|, \n";
      printf "     PRIMARY KEY (`code`) USING BTREE,  \n";
      printf "     KEY `index_cityCode` (`cityCode`) USING BTREE,  \n";
      printf "     KEY `index_all` (`provinceCode`,`cityCode`) USING BTREE  \n";
      printf ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4  COMMENT=|行政区|; \n";
      printf "INSERT INTO `%s`(`code`, `name`, `cityCode`, `provinceCode`) VALUES \n ", tableName;
      for(j=1;j<=i;j++){
         printf "(|%s|,|%s|,|%s|,|%s|",code[j],name[j],cityCode[j],provinceCode[j]
         closing="),\n"
         if(j==i){closing=");\n"}
         printf closing;
      }
   }' | tr '|' '"' > ./dist/MySQL-areas.sql

sqlite3 ./dist/data.sqlite "SELECT code,name,areaCode,cityCode,provinceCode FROM street ORDER BY code ;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; areaCode[i]=$3; cityCode[i]=$4; provinceCode[i]=$5 }
   END {
      tableName = "street"
      printf "DROP TABLE IF EXISTS `%s`; \n", tableName;
      printf "CREATE TABLE `%s` ( \n", tableName;
      printf "    `code` varchar(12)  NOT NULL COMMENT |编号|, \n";
      printf "    `name` varchar(50)  DEFAULT NULL COMMENT |名称|, \n";
      printf "    `areaCode` varchar(10)  DEFAULT NULL COMMENT |区编码|, \n";
      printf "    `cityCode` varchar(10)  DEFAULT NULL COMMENT |城市编码|, \n";
      printf "    `provinceCode` varchar(10)  DEFAULT NULL COMMENT |省份编码|, \n";
      printf "     PRIMARY KEY (`code`) USING BTREE,  \n";
      printf "     KEY `index_areaCode` (`areaCode`) USING BTREE,  \n";
      printf "     KEY `index_all` (`provinceCode`,`cityCode`,`areaCode`) USING BTREE  \n";
      printf ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4  COMMENT=|街道|; \n";
      count=10000
      for(j=1;j<=i;j++){
         batch=j%count
         if(batch==1){
            printf "INSERT INTO `%s`(`code`, `name`, `areaCode`, `cityCode`, `provinceCode`) VALUES \n ", tableName;
         }
         printf "(|%s|,|%s|,|%s|,|%s|,|%s|",code[j],name[j],areaCode[j],cityCode[j],provinceCode[j]
         closing="),\n"
         if(batch==0){closing=");\n"}
         else if(j==i){closing=");\n"}
         printf closing;
      }
   }' | tr '|' '"' > ./dist/MySQL-streets.sql


sqlite3 ./dist/data.sqlite "SELECT code,name,streetCode,areaCode,cityCode,provinceCode FROM village ORDER BY code ;" | awk -F'|' '
   { code[++i]=$1; name[i]=$2; streetCode[i]=$3; areaCode[i]=$4; cityCode[i]=$5; provinceCode[i]=$6 }
   END {
      tableName = "village"
      printf "DROP TABLE IF EXISTS `%s`; \n", tableName;
      printf "CREATE TABLE `%s` ( \n", tableName;
      printf "    `code` varchar(15)  NOT NULL COMMENT |编号|, \n";
      printf "    `name` varchar(50)  DEFAULT NULL COMMENT |名称|, \n";
      printf "    `streetCode` varchar(10)  DEFAULT NULL COMMENT |街道编码|, \n";
      printf "    `areaCode` varchar(10)  DEFAULT NULL COMMENT |区编码|, \n";
      printf "    `cityCode` varchar(10)  DEFAULT NULL COMMENT |城市编码|, \n";
      printf "    `provinceCode` varchar(10)  DEFAULT NULL COMMENT |省份编码|, \n";
      printf "     PRIMARY KEY (`code`) USING BTREE,  \n";
      printf "     KEY `index_streetCode` (`streetCode`) USING BTREE,  \n";
      printf "     KEY `index_all` (`provinceCode`,`cityCode`,`areaCode`,`streetCode`) USING BTREE  \n";
      printf ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4  COMMENT=|居委会|; \n";
      count=10000
      for(j=1;j<=i;j++){
         batch=j%count
         if(batch==1){
            printf "INSERT INTO `%s`(`code`, `name`, `streetCode`, `areaCode`, `cityCode`, `provinceCode`) VALUES \n ", tableName;
         }
         printf "(|%s|,|%s|,|%s|,|%s|,|%s|,|%s|",code[j],name[j],streetCode[j],areaCode[j],cityCode[j],provinceCode[j]
         closing="),\n"
         if(batch==0){closing=");\n"}
         else if(j==i){closing=");\n"}
         printf closing;
      }
   }' | tr '|' '"' > ./dist/MySQL-villages.sql

# 导入本地 MySQL 的 test 库
for SQL in dist/*.sql; do mysql -uroot test < $SQL; done
