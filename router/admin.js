const express = require("express")
const app = express()

// call model for admin
const admin = require("../models/index").admin

const md5 = require("md5")

// middleware for allow the request from body
app.use(express.urlencoded({extended:true}))

// authorization
const verifyToken = require("./verifyToken")

app.get("/", verifyToken, async(req,res) => {
    admin.findAll({
        include: ["level"]
    })
    .then(result => {
        res.json(result)
    })

    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", async(req,res) => {
    // tampung data request yang akan dimasukkan
    let data = {
        username: req.body.username,
        password: md5(req.body.password),
        nama_admin: req.body.nama_admin,
        id_level: req.body.id_level
    }

    // execute insert data
    admin.create(data)
    .then(result => {
        res.json({
            message: "Data has been inserted",
            data: result
        })
    })

    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.put("/", verifyToken, async(req,res) => {
    // tampung data request yang akan dimasukkan
    let data = {
        username: req.body.username,
        password: md5(req.body.password),
        nama_admin: req.body.nama_admin,
        id_level: req.body.id_level
    }

     // key yg menunjukkan data yg akan diubah
     let parameter = {
        id_admin: req.body.id_admin
    }

    // execute update data
    admin.update(data, {where: parameter})
    .then(result => {
        res.json({
            message: "Data has been updated",
            data: result
        })
    })

    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.delete("/:id_admin", verifyToken, async(req, res) => {
    let id_admin = req.params.id_admin

    let parameter = {
        id_admin: id_admin
    }

    admin.destroy({where : parameter})
    .then(result => {
        res.json({
            message: "Data has been deleted",
            data: result
        })
    })

    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

module.exports = app