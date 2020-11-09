const express = require("express")
const app = express()

// call model for tarif
const tarif = require("../models/index").tarif

// middleware for allow the request from body
app.use(express.urlencoded({extended:true}))

// authorization
const verifyToken = require("./verifyToken")
app.use(verifyToken)

app.get("/", async(req,res) => {
    tarif.findAll()
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
        daya: req.body.daya,
        tarifperkwh: req.body.tarifperkwh
    }

    // execute insert data
    tarif.create(data)
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

app.put("/", async(req,res) => {
    // tampung data request yang akan dimasukkan
    let data = {
        daya: req.body.daya,
        tarifperkwh: req.body.tarifperkwh
    }

     // key yg menunjukkan data yg akan diubah
     let parameter = {
        id_tarif: req.body.id_tarif
    }

    // execute update data
    tarif.update(data, {where: parameter})
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

app.delete("/:id_tarif", async(req, res) => {
    let id_tarif = req.params.id_tarif

    let parameter = {
        id_tarif: id_tarif
    }

    tarif.destroy({where : parameter})
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

// agar bisa dipanggil di lain file
module.exports = app 