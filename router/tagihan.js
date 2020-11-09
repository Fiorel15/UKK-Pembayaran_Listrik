const express = require("express")
const app = express()

// call model for tagihan
const tagihan = require("../models/index").tagihan
const penggunaan = require('../models/index').penggunaan

// middleware for allow the request from body
app.use(express.urlencoded({extended:true}))

// authorization
const verifyToken = require("./verifyToken")
app.use(verifyToken)

app.get("/", async(req,res) => {
    tagihan.findAll({
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
    const idPenggunaan = {
        id_penggunaan: req.body.id_penggunaan
    }

    let param = {
        id_penggunaan: req.body.id_penggunaan
    }

    // kalkulasi jumlah meter tagihan
    let dataPengg = await penggunaan.findOne({where: param})
    let jumlahMeter = await dataPengg.meter_akhir - dataPengg.meter_awal

    // tampung data request yang akan dimasukkan
    let data = {
        id_penggunaan: req.body.id_penggunaan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        jumlah_meter: jumlahMeter,
        status: false
    }

    // execute insert data
    tagihan.create(data)
    .then(result => {
        const updateStatus = {
            status: false
        }

        penggunaan.update(updateStatus, {where: idPenggunaan})
        .then(result => {
            res.json({
                success: 1,
                message: "Data has been inserted",
                data: result
            })
        })
        .catch(error => {
            // jika terjadi error ketika update status penggunaan
            res.json({
              success: 0,
              subject: 'Error when update status penggunaan',
              message: error.message
            })
          })

      })
      .catch((error) => {
        // jika terjadi error ketika create tagihan
        res.json({
          success: 0,
          subject: 'Error when create tagihan',
          message: error.message
        })
    })
})

app.put("/", async(req,res) => {
    // tampung data request yang akan dimasukkan
    let data = {
        id_penggunaan: req.body.id_penggunaan,
        bulan: req.body.bulan,
        tahun: req.body.tahun,
        jumlah_meter: req.body.jumlah_meter,
        status: false
    }

     // key yg menunjukkan data yg akan diubah
     let parameter = {
        id_tagihan: req.body.id_tagihan
    }

    // execute update data
    tagihan.update(data, {where: parameter})
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

app.delete("/:id_tagihan", async(req, res) => {
    let id_tagihan = req.params.id_tagihan

    let parameter = {
        id_tagihan: id_tagihan
    }

    tagihan.destroy({where : parameter})
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