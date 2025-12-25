import { count } from 'console'
import {promises as fs} from 'fs'

const pathUsers = "data/users.json"

export async function getArrUsers(){
    const data = await fs.readFile(pathUsers,"utf8")
    const users = await JSON.parse(data)
    return users
}

async function isUser(user){
    if(typeof user !== 'object'){
        return false
    }
    const keys = ["username","password"]
    let count = 0
    for(let k1 in user){
       for(let k2 of keys){
        if(String(k1).toLowerCase() === String(k2).toLowerCase()){
            count+=1
        }
       }
    }
    if(count === 2){
        return true
    }
    return false
}

async function nameUniq(user){
    const users = await getArrUsers()
    for(let u of users){
        if(String(user.username).toLowerCase() === String(u.username).toLowerCase()){
            return false
        }
    }
    return true
}

export async function writeUser(user){
    const ifUser = await isUser(user)
    if(ifUser === false){
        return {"false":"missing data"}
    }
    const uniq = await nameUniq(user)
    if(uniq === false){
        return {"false":"name alredy exist"}
    }
    const users = await getArrUsers()
    users.push(user)
    await fs.writeFile(pathUsers,JSON.stringify(users))
    return {"true":user}
}


