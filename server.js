import express from 'express'
import { writeUser } from './utils/user.js';
import { checkIfUser, writeEvent } from './utils/event.js';
import { checkIfEvent, byTicket } from './utils/ticets.js';
import { getTicets } from './utils/getTicets.js';

const app = express()



app.use(express.json())

app.post("/user/register", async (req, res) => {
    const user = req.body
    const write = await writeUser(user)
    for (let k in write) {
        if (k === "true") {
            res.json({ "message": "User registered successfully" })
        } else {
            if (write[k] === "missing data") {
                res.status(409)
                res.json(write)
            } else {
                res.status(400)
                res.json(write)
            }
        }
    }
})

app.post("/creator/events", checkIfUser, async (req, res) => {
    const event = req.body
    const write = await writeEvent(event)
    for (let k in write) {
        if (k === "false") {
            if (write[k] === "missing data") {
                res.status(409)
                res.json(write)
            } else {
                res.status(400)
                res.json(write)
            }
        } else {
            res.json(write)
        }
    }
})

app.post("/users/tickets/buy", checkIfUser, checkIfEvent, async (req, res) => {
    const ticet = req.body
    const buy = await byTicket(ticet)
    for (let k in buy) {
        if (k === "false") {
            if (buy[k] === "missing data") {
                res.status(409)
                res.json(buy)
            } else {
                res.status(400)
                res.json(buy)
            }
        } else {
            res.json(buy)
        }
    }
})

app.get("/users/:username/summary",async(req,res)=>{
    const name = req.params
    const get = await getTicets(name.username)
    res.json(get)
})

app.listen(3000, () => {
    console.log("server run");
})
