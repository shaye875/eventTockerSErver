import { getArrTiccets } from './ticets.js'

const pathTicets = "data/receipts.json"

async function totalByNmae(name) {
    const ticets = await getArrTiccets()
    let total = 0
    for (let t of ticets) {
        if (t.username === name) {
            total += Number(t.ticketsBought)
        }
    }
    return total
}

async function totalEvents(name) {
    const ticets = await getArrTiccets()
    const events = []
    for (let t of ticets) {
        if (t.username === name) {
            let bool = true
            for (let e of events) {
                if (t.eventName === e) {
                    bool = false
                }
            }
            if (bool === true) {
                events.push(t.eventName)
            }
        }
    }
    return events
}

async function avergeTicets(name) {
    const ticets = await getArrTiccets()
    const numbers = []
    for (let t of ticets) {
        if (t.username=== name) {
            
            numbers.push(Number(t.ticketsBought))
        }
    }
    let sum = 0
    for (let n of numbers) {
        sum += n
    }
    return sum / numbers.length
}

export async function getTicets(name) {
    const totalticets = await totalByNmae(name)
    const eventsArr = await totalEvents(name)
    const averge = await avergeTicets(name)
    return {
        totalTicketsBought: totalticets,
        events: eventsArr,
        averageTicketsPerEvent:averge
    }
}
