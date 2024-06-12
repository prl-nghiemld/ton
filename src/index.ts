import { MONGODB_URI, MNEMONICS } from "./config"
import { connectMongo } from "./mongodb"
import { Wallet } from "./tonweb"

async function start() {
    await connectMongo(MONGODB_URI)
    const wallet = new Wallet(MNEMONICS) 
    await wallet.getTransactions2()

}

start()