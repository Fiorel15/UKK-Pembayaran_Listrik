const express = require("express")
const app = express()

// call library multer
// ----------------------------------------------------
// library u/ upload file
const multer = require("multer")
// multer digunakan u/ membaca data request dari form-data

const path = require("path")
// path digunakan u/ manage direktori file

const fs = require("fs")
// fs digunakan u/ mengatur file

// tentukan di mana file akan disimpan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./bukti")
    },
    filename: (req, file, cb) => {
        cb(null, "bukti-" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})
// ----------------------------------------------------

// authorization
const verifyToken = require("./verifyToken")
app.use(verifyToken)

// date
let date = new Date()

// call model for pembayaran
const pembayaran = require("../models/index").pembayaran
const tagihan = require("../models/index").tagihan
const tarif = require("../models/index").tarif

// middleware for allow the request from body
app.use(express.urlencoded({extended:true}))

app.get("/", async(req,res) => {
    pembayaran.findAll({
        include: ["tagihan", "admin"]
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

app.post("/", upload.single('bukti'), async(req,res) => {
    // ambil id_tagihan
    const idTagihan = {
        id_tagihan: req.body.id_tagihan,
      };
    
      // ambil id_tarif
      const idTarif = {
        id_tarif: req.body.id_tarif,
      };
    
      // findOne id_tagihan (untuk memanggil id_tagihan yang dipinjam)
      tagihan.findOne({ where: idTagihan })
        .then((resultTagihan) => {
          const jumlah_meter = resultTagihan.jumlah_meter;
    
          // findOne id_tarif (untuk memanggil data tarif)
          tarif.findOne({ where: idTarif })
            .then((resultTarif) => {
              const tarifPerKwh = resultTarif.tarifperkwh
              const biayaAdmin = Number(req.body.biaya_admin)
              const total = jumlah_meter * tarifPerKwh + biayaAdmin
    
              // tampung data request yang akan dimasukkan
            let data = {
                id_tagihan: req.body.id_tagihan,
                tanggal_pembayaran: date,
                bulan_bayar: req.body.bulan_bayar,
                biaya_admin: req.body.biaya_admin,
                total_bayar: total,
                status: true,
                bukti: req.file.filename,
                id_admin: req.body.id_admin
            }
    
              // excute insert data
              pembayaran.create(data)
                .then((result) => {
                  const updateStatus = {
                    status: true,
                  };
    
                  // update status tagihan
                  tagihan.update(updateStatus, { where: idTagihan })
                    .then((_) => {
                      res.json({
                        success: 1,
                        message: 'Data has been inserted',
                        data: result,
                      });
                    })
                    .catch((error) => {
                      // jika terjadi error ketika update status tagihan
                      res.json({
                        success: 0,
                        subject: 'Error when update status tagihan',
                        message: error.message,
                      });
                    });
                })
                .catch((error) => {
                  // jika terjadi error ketika create pembayaran
                  res.json({
                    success: 0,
                    subject: 'Error when create pembayaran',
                    message: error.message,
                  });
                });
            })
            .catch((error) => {
              // jika terjadi error ketika findOne tarif
              res.json({
                success: 0,
                subject: 'Error when findOne tarif',
                message: error.message,
              });
            });
        })
        .catch((error) => {
          // jika terjadi error ketika findOne tagihan
          res.json({
            success: 0,
            subject: 'Error when findOne tagihan',
            message: error.message,
          });
        });
});




    // mengubah status
    // let id = { id_tagihan: data.id_tagihan }
    // let status = { status: 1 }
    // tagihan.update(status, {where: id})

    // execute insert data
    // pembayaran.create(data)
    // .then(result => {
    //     res.json({
    //         message: "Data has been inserted",
    //         data: result
    //     })
    // })

    // .catch(error => {
    //     res.json({
    //         message: error.message
    //     })
    // })


app.put("/", upload.single("bukti"), async(req,res) => {
    // tampung data request yang akan dimasukkan
    let data = {
        id_tagihan: req.body.id_tagihan,
        tanggal_pembayaran: date,
        bulan_bayar: req.body.bulan_bayar,
        biaya_admin: req.body.biaya_admin,
        total_bayar: req.body.total_bayar,
        status: true,
        id_admin: req.body.id_admin
    }

     // key yg menunjukkan data yg akan diubah
    let param = {
        id_pembayaran: req.body.id_pembayaran
    }

    if (req.file) {
        let oldPembayaran = await pembayaran.findOne({ where: param })
        let oldBukti = oldPembayaran.bukti

        // delete old file
        let pathFile = path.join(__dirname, "../bukti", oldBukti)
        fs.unlink(pathFile, error => console.log(error))

        data.bukti = req.file.filename
    }

    // execute insert data
    pembayaran.update(data, ({where : param}))
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

app.delete("/:id_pembayaran", async(req, res) => {
    let id_pembayaran = req.params.id_pembayaran

    let parameter = {
        id_pembayaran: id_pembayaran
    }

    // ambil data yg akan dihapus
    let oldPembayaran = await pembayaran.findOne({ where: parameter })
    let oldBukti = oldPembayaran.bukti

    // delete oldCover
    let pathFile = path.join(__dirname, "../bukti", oldBukti)
    fs.unlink(pathFile, error => console.log(error))

    pembayaran.destroy({where : parameter})
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