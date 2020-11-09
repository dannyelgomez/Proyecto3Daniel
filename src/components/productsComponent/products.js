const sequelize = require('../../commons/database/conexion');
const { is_numeric } = require('../securityComponent/security');

const addProducts = async(req, res, next) => {
    let { name, price, img_url, description } = req.body;
    if (!name || !price || !img_url || !description) {
        res.status(400).json('Petición incompleta o equivocada');
        next();
    } else {
        await sequelize.query(`INSERT INTO products (name, price, img_url, description) 
        VALUES ('${name}',${price},'${img_url}','${description}')`)
            .then(result => {
                console.log("Number of records inserted: " + result[1]);
            }).catch(err => {
                console.error(err)
            });
        res.status(201).json('Ha sido agregado correctamente el producto');
        next();
    }
};

const getProducts = async(req, res, next) => {
    let id = req.query.id ? is_numeric(req.query.id) : 'allproducts';
    if (id == 'allproducts') {
        //busca lista de productos
        await sequelize.query('SELECT * FROM products', {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                console.error(err)
                res.status(400).json('No se ha encontrado la información por un error');
            });
        return
    };
    if (id != false) {
        //busca por id
        await sequelize.query(`SELECT * FROM products WHERE product_id=${id}`, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                console.error(err)
                res.status(400).json('No se ha encontrado la información por un error');
            });
        console.log('Busqueda por una id');
        next();
    } else {
        return res.status(400).json('Sólo es permitid utilizar números para el query');
    };
    next();
};

const updateProducts = async(req, res, next) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('El id es requerido');
    let { name, price, img_url, description } = req.body;
    if (!id || !name || !price || !img_url || !description) {
        res.status(400).json('Petición incompleta o equivocada');
        next();
    } else {
        if (id != false) {
            await sequelize.query(`UPDATE products SET name='${name}', price=${price}, img_url='${img_url}', description='${description}' 
        WHERE  product_id=${id}`)
                .then(result => {
                    console.log("Number of records update: " + result[1]);
                }).catch(err => {
                    console.error(err)
                });

            res.status(200).json('Satisfactoriamente se ha actualizado');
        }

        next();
    }
};

const deleteProducts = async(req, res) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('Falta parametro id');
    console.log(id);
    if (!id) {
        res.status(406).json('La identificación es requerida');
    } else {
        if (id != false) {
            await sequelize.query(`SELECT * FROM orders_products WHERE product_id=${id}`) //valida si hay productos asociados a una orden
                .then(result => {
                    if (result[0] == null || result[0] == [] || result[0] == "") { //Sino tiene relación con la tabla order_product -> busca en products
                        sequelize.query(`SELECT * FROM products WHERE product_id=${id}`, {
                                type: sequelize.QueryTypes.SELECT,
                            })
                            .then(result => {
                                if (result == null || result == [] || result == "") {
                                    res.status(400).json(`El producto con id:${id} no se ha podido eliminar`);
                                    console.log('El producto no existe');
                                } else {
                                    sequelize.query(`DELETE FROM products WHERE product_id =${id}`) //borra el producto sino esta asociado a una orden
                                        .then(result => {
                                            if (result[1] != 0) {
                                                res.status(200).json(`El Producto con id ${id} se ha eliminado`);
                                            } else {
                                                res.status(406).json(`Eliminar no es posible`);
                                            }
                                            console.log("Number of rows delete: " + result[1]);
                                        }).catch(err => {
                                            console.error(err)
                                        });
                                }
                            }).catch(err => {
                                console.error(err)
                                res.status(400).json('Al buscar la información se ha encontrado un error');
                            });

                    } else { //si tiene relación elimina la relación y despues va a la tabla de productos a eliminarlo
                        sequelize.query(`DELETE FROM orders_products WHERE product_id=${id}`)
                            .then(result => {
                                console.log(result);
                                sequelize.query(`DELETE FROM products WHERE product_id =${id}`) //borra el producto sino esta asociado a una orden
                                    .then(result => {
                                        if (result[1] != 0) {
                                            res.status(200).json(`El producto con id ${id} ha sido eliminado`);
                                        } else {
                                            res.status(406).json(`Eliminar no ha sido posible`);
                                        }
                                        console.log("Number of rows delete: " + result[1]);
                                    }).catch(err => {
                                        console.error(err)
                                    });
                            }).catch(err => {
                                console.error(err)
                            });
                    }
                    console.log("Number of rows delete: " + result[1]);
                }).catch(err => {
                    console.error(err)
                });
        }
    }
};

module.exports = {
    addProducts,
    getProducts,
    updateProducts,
    deleteProducts,
}