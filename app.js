const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json());

//secret to be accessed in global scope
const secret = 'ImVerySecretKey001';

//create a token and send back to client
app.post('/create_token', (req, res) => {
    //payload
    const payload = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        id: req.body.id
    };
    //secret
   // const secret = 'ImVerySecretKey001'; moved from this route scope to global scope above
    
    //expiry time
    const expiry = 48000;
    //create token
    jwt.sign(payload, secret, { expiresIn: expiry }, (err, token) => {
        if (err) {
            return res.status(500).json({ err })
        } else {
            return res.status(200).json({ token })
        }
    })
});

//receive a token from client and decode
app.get('/decode_token', (req, res) => {
    console.log(req.headers)
    if (!req.headers.authorization) {
        return res.status(401).json({ message: 'Authorization token is required' })
    }
    //pick auth header
    const authHeader = req.headers.authorization
    console.log(authHeader)
    //extract token
    const splittedStr = authHeader.split(' ')
    const token = splittedStr[1]
    console.log(splittedStr)
    //decode token
    jwt.verify(token, secret, (err, decodedToken) => {
        if (err) {
            return res.status(500).json({ err })
        } else {
            return res.status(200).json({ user: decodedToken })
        }
    })
});

app.listen(3000, () => console.log('Server running on Port 3000'));