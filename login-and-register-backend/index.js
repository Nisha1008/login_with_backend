import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import promisify from "util"
// const promiseTimeout = promisify(setTimeout);
// promiseTimeout(1000).then(() => console.log("I am a promise"));
const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect('mongodb://127.0.0.1:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
},).then(() => console.log('DB conneted')).catch((err) => { console.error(err); });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

function promiseTimeout(delay) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, delay)
    })
}
//routes
app.get("/", (req, res) => {
    res.send("myapi");
})

app.use(function (err, req, res, text) {
    console.error(err.stack)
    res.type('text/plain')
    res.status(500)
    res.send('internal server error 500')
})

app.post("/login", (req, res) => {
    res.send("login page");
})
app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (user) {
            res.send({ message: "User already registered" })
        } else {
            const user = new User({
                name,
                email,
                password
            })
            user.save(err => {
                if (err) {
                    req.send(err)
                } else {
                    res.send({ message: "Sucessfully Registered" })
                }
            })

        }
    })

    // console.log(req.body);
})

promiseTimeout(1000).then(() => console.log("I am a promise"));
app.listen(5000, () => {
    console.log("be started at port 5000");
})