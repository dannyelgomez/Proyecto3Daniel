CREATE DATABASE DB_INICIAL1;
USE DB_INICIAL1;

-- Table Creation
CREATE TABLE users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR (60) NOT NULL,
  password VARCHAR (60) NOT NULL,
  full_name VARCHAR(60) NOT NULL,
  email VARCHAR(60) NOT NULL,
  phone INT NOT NULL,
  delivery_address VARCHAR (60) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  is_disabled BOOLEAN DEFAULT FALSE
);

-- Populate users table
INSERT INTO
  users
VALUES
  (NULL,"daniel","danny123","Daniel Gomez","danny57@gmail.com",3007243432,"Cra 14 # 8-12",TRUE,FALSE),
  (NULL,"andrea","nic089","Andrea Zapata","and_058@hotmail.com",3154568212,"Calle 101 #74-35",FALSE,FALSE),
  (NULL,"luis","457Bedoya","Luis Bedoya","lube45@gmail.com",3123125252,"Calle 35 #66B-30",FALSE,FALSE),
  (NULL,"Cristina","cris.45","Cristian Rua","c.rua.82@gmail.com",3189782536,"Av 57 #13-49",FALSE,FALSE);
   
CREATE TABLE products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR (60) NOT NULL,
  price FLOAT NOT NULL,
  img_url VARCHAR(200) NOT NULL,
  description VARCHAR(150) NOT NULL,
  is_disabled BOOLEAN DEFAULT FALSE
);

-- Populate products table
INSERT INTO
  products
VALUES
  (NULL,"Arepa pollo champiñones",9,"https://via.placeholder.com/231","pollo, salchicha, champiñones",FALSE),
  (NULL,"Arepa hawaiana",8,"https://via.placeholder.com/327","piña, queso, salchicha",FALSE),
  (NULL,"Arepa paisa",10,"https://via.placeholder.com/615","chorizo, maicitos, jamón",FALSE),
  (NULL,"Arepa campesina",8,"https://via.placeholder.com/019","queso, chorizo, maicitos",FALSE),
  (NULL,"Arepa carnes",9,"https://via.placeholder.com/991"," res, chorizo, tocineta",FALSE),
  (NULL,"Arepa mixta",11,"https://via.placeholder.com/758","pollo, tocineta, res",FALSE),
  (NULL,"Arepa ranchera",10,"https://via.placeholder.com/951","tocineta, queso, chorizo,",FALSE);
  
CREATE TABLE orders (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  status VARCHAR(60) NOT NULL,
  date DATETIME NOT NULL,
  description VARCHAR(150) NOT NULL,
  payment_method VARCHAR (60) NOT NULL,
  total FLOAT NOT NULL,
  user_id INT NOT NULL DEFAULT "0",
  is_disabled BOOLEAN DEFAULT FALSE,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

-- Populate orders table
INSERT INTO
  orders
VALUES
  (NULL,"delivered",NOW(),"2 x Arepa ranchera","card",20,1,FALSE),
  (NULL,"canceled",NOW(),"1 x Arepa Mixta","card",11,2,FALSE),
  (NULL,"sending",NOW(),"1 x Arepa paisa, 1 x Arepa ranchera","cash",20,3,FALSE),
  (NULL,"preparing",NOW(),"2 x Arepa pollo champiñones","cash",18,1,FALSE),
  (NULL,"confirmed",NOW(),"1 x Arepa hawaina","card",8,2,FALSE),
  (NULL,"new",NOW(),"1 x Arepa ranchera","cash",10,3,FALSE);

CREATE TABLE orders_products (
  order_prod_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT,
  product_id INT,
  product_amount INT NOT NULL,
  FOREIGN KEY(order_id) REFERENCES orders(order_id),
  FOREIGN KEY(product_id) REFERENCES products(product_id)
);

-- Populate orders_products table
INSERT INTO
  orders_products
VALUES
  (NULL, 1, 1, 1),
  (NULL, 1, 4, 2),
  (NULL, 2, 4, 2),
  (NULL, 3, 4, 2),
  (NULL, 4, 5, 1),
  (NULL, 5, 6, 1),
  (NULL, 6, 7, 1);