# Proyecto3Daniel

Delilah Restó
Backend

App de pedidos de comida
Objetivo: API que permita realizar altas, bajas, modificaciones y obtención de información sobre una estructura de datos que podría consumir un cliente. Parte del desafío estará enfocado en lograr que el desarrollo del proyecto sea puesto en producción utilizando web services.
Recursos necesarios:
Node.js, Nodemon, Express, JWT, MySQL, Sequelize, Postman, Swagger 

Documentación de la API:
Abrir el archivo documentation.yml y copiar su contenido en Swagger o importar.
Proyecto:
1.	Clonar el repositorio: git clone https://github.com/dannyelgomez/Proyecto3Daniel.git

2.	Instalación de dependencias:
npm install
Esto permite instalar las siguientes dependencias:
Dotenv, Express, Helmet, Jsonwebtoken, Mysql, mysql2, sequelize

3.	Creando base de datos:
  Abrir XAMPP y sobre el puerto 3300
  Ejecutar los servicios de Apache y MySQL
  Abrir (Admin) del servicio MySQL
  Generar una nueva Base de datos: DB_INICIAL1
  Abrir el archivo en bd.sql 
 
Crear archivo .env en la carpeta raíz
  DB_HOST=localhost
  DB_NAME=db_inicial1
  DB_USER=root
  DB_PASS=
  DB_PORT=3306

4.	Iniciando el servidor:
Ejecutar en consola nodemon server.js o utilizando:
node server.js

5.	Ahora lo esperado
Ejecutar los Endpoints desde Postman.
