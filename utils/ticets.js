import { promises as fs } from 'fs'
import { getArrEvents } from './event.js'

const pathEvents = "data/events.json"

const pathTicets = "data/receipts.json"

export async function checkIfEvent(req, res, next) {
    const events = await getArrEvents()
    const body = req.body
    for (let e of events) {
        if (String(body["eventName"]) === String(e.eventName)) {
            next()
        } else {
            res.status(401)
            res.json({ "false": "event not exist" })
        }
    }
}

export async function getArrTiccets() {
    const data = await fs.readFile(pathTicets, "utf8")
    const ticets = await JSON.parse(data)
    return ticets
}

async function isTicet(ticet) {
    if (typeof ticet !== 'object') {
        return false
    }
    const keys = ["username", "password", "eventName", "quantity"]
    let count = 0
    for (let k1 in ticet) {
        for (let k2 of keys) {
            if (String(k1).toLowerCase() === String(k2).toLowerCase()) {
                count += 1
            }
        }
    }
    if (count === 4) {
        return true
    }
    return false
}

async function isAvillable(eventNmae, num) {
    const events = await getArrEvents()
    for (let e of events) {
        if (String(e.eventName) === String(eventNmae)) {
            if (Number(e.ticketsForSale) >= num) {
                e.ticketsForSale -= num
                await fs.writeFile(pathEvents, JSON.stringify(events))
                return true
            }
            return false
        }
    }
}

export async function byTicket(ticet) {
    const ifTicet = await isTicet(ticet)
    if (ifTicet === false) {
        return { "false": "missing data" }
    }
    const ifAvillable = await isAvillable(ticet.eventName,ticet.quantity)
    if(ifAvillable === false){
        return {"false":"No tickets left"}
    }
    const ticets = await getArrTiccets()
    ticets.push({
        username:ticet.username,
        eventName:ticet.eventName,
        ticketsBought:ticet.quantity
    })
    await fs.writeFile(pathTicets, JSON.stringify(ticets))
    return { "message": "Tickets purchased successfully" }
}
