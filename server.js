const express = require("express")
const app = express()

// call router
let admin = require("./router/admin")
let level = require("./router/level")
let pelanggan = require("./router/pelanggan")
let pembayaran = require("./router/pembayaran")
let penggunaan = require("./router/penggunaan")
let tagihan = require("./router/tagihan")
let tarif = require("./router/tarif")
let auth = require("./router/auth")

app.use("/admin", admin)
app.use("/level", level)
app.use("/pelanggan", pelanggan)
app.use("/pembayaran", pembayaran)
app.use("/penggunaan", penggunaan)
app.use("/tagihan", tagihan)
app.use("/tarif", tarif)
app.use("/auth", auth)


app.listen(8000, function (err) {
    if (!err)
        console.log("server run on port 8000");
    else console.log(err)
})
