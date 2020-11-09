const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const md5 = require("md5")

// model pelanggan dan admin
const pelanggan = require('../models/index').pelanggan
const admin = require('../models/index').admin
app.use(express.urlencoded({extended: true}))

app.post('/:orang', async(req,res) => {
    let data = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    let param = {
         orang: req.params.orang
    }

    let result = null

    if(param.orang === "pelanggan"){
        result = await pelanggan.findOne({where: data})
    } else if(param.orang === "admin"){
        result = await admin.findOne({where: data})
    }

    if(result == null){
        res.json({
            message: "Invalid username or password"
        })
    }else{
        // login success
        // generate token using jwt
        // jwt->header, payload, secretKey
        let jwtHeader = {
            algorithm: 'HS256',
            expiresIn: '2h'
        }
        let payload = {data: result}
        let secretKey = "bayarlistrik"

        let token = jwt.sign(payload, secretKey, jwtHeader)
        res.json({
            data: result,
            token: token
        })
    }

})

module.exports = app