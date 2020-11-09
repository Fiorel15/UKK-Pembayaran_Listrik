const express = require("express")
const app = express()

// call model for penggunaan
const penggunaan = require("../models/index").penggunaan

// middleware for allow the request from body
app.use(express.urlencoded({extended:true}))

// authorization
const verifyToken = require("./verifyToken")
app.use(verifyToken)

app.get("/", async(req,res) => {
    penggunaan.findAll({
        include: [{ all: true, nested: true }]
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
        id_pelanggan: req.body.id_pelanggan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir
    }

    // execute insert data
    penggunaan.create(data)
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
        id_pelanggan: req.body.id_pelanggan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        meter_awal: req.body.meter_awal,
        meter_akhir: req.body.meter_akhir
    }

     // key yg menunjukkan data yg akan diubah
     let parameter = {
        id_penggunaan: req.body.id_penggunaan
    }

    // execute update data
    penggunaan.update(data, {where: parameter})
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

app.delete("/:id_penggunaan", async(req, res) => {
    let id_penggunaan = req.params.id_penggunaan

    let parameter = {
        id_penggunaan: id_penggunaan
    }

    penggunaan.destroy({where : parameter})
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