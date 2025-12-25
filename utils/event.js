import {promises as fs} from 'fs'
import { getArrUsers } from './user.js'

const pathUsers = "data/users.json"

const pathEvents = "data/events.json"

export async function checkIfUser(req,res,next){
    const users = await getArrUsers()
    const body = req.body
    for(let u of users){
    if(String(body["username"]) === String(u.username) && String(body["password"]) === String(u.password)){
      next()
    }else{
        res.status(401)
        res.json({"false":"user not exist"})
    }
}
}

export async function getArrEvents(){
    const data = await fs.readFile(pathEvents,"utf8")
    const events = await JSON.parse(data)
    return events
}

async function isEvent(event){
    if(typeof event !== 'object'){
        return false
    }
    const keys = ["username","password","eventName","ticketsForSale"]
    let count = 0
    for(let k1 in event){
       for(let k2 of keys){
        if(String(k1).toLowerCase() === String(k2).toLowerCase()){
            count+=1
        }
       }
    }
    if(count === 4){
        return true
    }
    return false
}

async function eventUniq(event){
    const events = await getArrEvents()
    for(let u of events){
        if(String(event.eventName).toLowerCase() === String(u.eventName).toLowerCase()){
            return false
        }
    }
    return true
}

export async function writeEvent(event){
    const ifEvent = await isEvent(event)
    if(ifEvent === false){
        return {"false":"missing data"}
    }
    const uniq = await eventUniq(event)
    if(uniq === false){
        return {"false":"name alredy exist"}
    }
    const obj = {
        username:event.username,
        eventName:event.eventName,
        ticketsForSale:event.ticketsForSale
    }
    const events = await getArrEvents()
    events.push(obj)
    await fs.writeFile(pathEvents,JSON.stringify(events))
    return {"message": "Event created successfully"}
}
