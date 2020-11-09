const { response } = require('express');
const sequelize = require('../../commons/database/conexion');
const { validateToken, is_numeric, validateAdmin } = require('../securityComponent/security');

const getOrder = async(req, res, next) => {
    let is_admin = validateAdmin(req, res);
    if (is_admin == 'is_admin') {
        //busca lista de productos
        await sequelize.query('SELECT * FROM orders', {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                console.error(err)
                res.status(400).json('Información no obtenida por un error');
            });
        return
    } else {
        await sequelize.query(`SELECT * FROM orders WHERE user_id=${is_admin}`, {
                type: sequelize.QueryTypes.SELECT,
            })
            .then(result => {
                res.status(200).json(result);
            }).catch(err => {
                console.error(err)
                res.status(400).json('Información no obtenida por un error');
            });
    };
    next();
};

const addOrder = async(req, res, next) => {
    const user_id = req.token_info.user_id;
    console.log(user_id);
    let { payment_method, products } = req.body;
    if (typeof(products) != "object") {
        products = false;
    }
    if (!payment_method || !products) {
        res.status(400).json('Petición incompleta o equivocada');
        console.log('Datos incompletos');
        next();
    } else {
        let desiredProducts = [];
        products.forEach((element) => {
            desiredProducts.push(element.product_id)
        });
        await sequelize.query(`SELECT * FROM products WHERE product_id IN (${desiredProducts})`, { //busca los productos a guardar en la orden
                type: sequelize.QueryTypes.SELECT,
            })
            .then(async result => {
                let total = 0;
                let description = "";
                let ord_id;
                result.forEach((product, index) => {
                    total += product.price * products[index].amount;
                    description += `${products[index].amount}x ${product.name}, `;
                });
                description = description.substring(0, description.length - 2);
                const order = await sequelize.query(
                    `INSERT INTO orders (status, date, description, payment_method, total, user_id) 
                    VALUES (:status, :date, :description, :payment_method, :total, :user_id)`, {
                        replacements: {
                            status: "new",
                            date: new Date(),
                            description,
                            payment_method: payment_method,
                            total,
                            user_id,
                        },
                    }
                ).then(result => {
                    ord_id = result;
                }).catch(err => {
                    console.error(err)
                });
                products.forEach(async(product) => {
                    const order_products = await sequelize.query(
                            `INSERT INTO orders_products (order_id, product_id, product_amount) 
                        VALUES (${ord_id[0]}, ${product.product_id}, ${product.amount})`)
                        .then(result => {
                            console.log("Number of rows insert: " + result[1] + " in table Orders_Products");
                        }).catch(err => {
                            console.error(err)
                        });
                })

                res.status(200).json('Ha sido agregada correctamente la orden');
                console.log('Los datos están incompletos');
                next();
            }).catch(err => {
                console.error(err)
            });
    };
}

const updateOrder = async(req, res, next) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('El id es requerido');
    console.log(id)
    let { status } = req.body;
    if (!status) {
        res.status(400).json('La identificacion o estatus son requeridos');
        next();
    } else {

        try {
            const order = await sequelize.query("SELECT * FROM orders WHERE order_id = :order_id;", {
                replacements: { order_id: id },
                type: sequelize.QueryTypes.SELECT,
            }).then(async(result) => {
                if (result !== '') {
                    const update = await sequelize.query("UPDATE orders SET status = :status WHERE order_id = :order_id", {
                        replacements: {
                            order_id: id,
                            status: status,
                        },
                    });
                    res.status(200).json(`Orden ${id} ha sido correctamente modificada`);
                }
            })

            if (!!order.length) {
                const update = await sequelize.query("UPDATE orders SET status = :status WHERE order_id = :order_id", {
                    replacements: {
                        order_id: id,
                        status: status,
                    },
                });
                res.status(200).json(`Orden ${id} ha sido correctamente modificada`);
            } else {
                res.status(404).json("Los resultados no se han podido encontrar");
            }
        } catch (error) {
            next(new Error(error));
        }

        next();
    }
};

const deleteOrder = async(req, res, next) => {
    let id = req.query.id ? is_numeric(req.query.id) : console.log('El id es requerido');
    if (!id) {
        res.status(400).json('Falta la identificación o identificación debe ser númerica');
        next();
    } else {
        if (id != false) {
            await sequelize.query(`DELETE FROM orders_products WHERE order_id =${id}`)
                .then(result => {
                    console.log("Number of rows delete: " + result[0].affectedRows + " de la tabla ordernes_productos");
                    sequelize.query(`DELETE FROM orders WHERE order_id =${id}`)
                        .then(result => {
                            console.log("Number of rows delete: " + result[0].affectedRows + " de la tabla ordernes");

                        }).catch(err => {
                            console.error(err)
                        });
                }).catch(err => {
                    console.error(err)
                });

            res.status(200).json(`La orden ${id} se ha eliminado de manera satisfactoria`);
        }
        next();
    }
};

module.exports = {
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder,
}