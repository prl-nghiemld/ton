import TonWeb from 'tonweb'
import { mnemonicToWalletKey } from '@ton/crypto'
import axios from 'axios'

export class Wallet {
    tonweb = new TonWeb(new TonWeb.HttpProvider('https://testnet.toncenter.com/api/v2/jsonRPC'))
    // scanUrl = "https://testnet.tonscan.org/"
    mnemonics: string[]

    constructor(
        mnemonics: string[]
    ) {
        this.mnemonics = mnemonics
    }

    private async getWallet() {
        const keyPair = await mnemonicToWalletKey(this.mnemonics)

        const WalletClass = this.tonweb.wallet.all['v4R2']
        return {
            instance: new WalletClass(this.tonweb.provider, {
                publicKey: keyPair.publicKey,
                wc: 0
            }),
            keyPair
        }
    }

    async getWalletAddress() {
        const wallet = await this.getWallet()
        const walletAddress = await wallet.instance.getAddress()
        return walletAddress.toString(true, true, false, true)
    }

    async getWalletSeq() {
        const wallet = await this.getWallet()
        const seqno = (await wallet.instance.methods.seqno().call()) || 0
        return seqno
    }

    async getWalletBalance(walletAddress: string) {
        return await this.tonweb.getBalance(walletAddress)
    }

    async getTransactions() {
        const address = await this.getWalletAddress()
        const apiUrl = `https://testnet.toncenter.com/api/v2/getTransactions?address=${address}&limit=10&to_lt=0&archival=true`
        const response = await axios.get(apiUrl)
        return response
    }

    async getTransactions2() {
        const address = await this.getWalletAddress()
        const transactions = await this.tonweb.getTransactions(address)
        return transactions
    }

    async transferTon(amount: string, receiver: string) {
        const wallet = await this.getWallet()
        const seqno = await this.getWalletSeq()

        const build = wallet.instance.methods.transfer({
            secretKey: wallet.keyPair.secretKey,
            toAddress: receiver,
            amount: TonWeb.utils.toNano(amount),
            seqno,
            payload: `Seq no ${seqno}`,
            sendMode: 3,
        })

        const query = await build.getQuery()

        const hash = await query.hash()
        const hash_hex = Buffer.from(hash).toString("hex")
        console.log({ hash_hex })

        // const result = await build.send()
    }
}

async function getWalletSeq() {
    // const nonBounceableAddress = address.toString(true, true, false)

    // const seqno = await wallet.methods.seqno().call()

    // await wallet.deploy(secretKey).send() // deploy wallet to blockchain

    // const fee = await wallet.methods.transfer({
    //     secretKey,
    //     toAddress: 'EQDjVXa_oltdBP64Nc__p397xLCvGm2IcZ1ba7anSW0NAkeP',
    //     amount: TonWeb.utils.toNano(0.01), // 0.01 TON
    //     seqno: seqno,
    //     payload: 'Hello',
    //     sendMode: 3,
    // }).estimateFee()

    // const Cell = TonWeb.boc.Cell
    // const cell = new Cell()
    // cell.bits.writeUint(0, 32)
    // cell.bits.writeAddress(address)
    // cell.bits.writeGrams(1)
    // console.log(cell.print()) // print cell data like Fift
    // const bocBytes = cell.toBoc()

    // const history = await tonweb.getTransactions(address)

    // const balance = await tonweb.getBalance(address)

    // tonweb.sendBoc(bocBytes)

    return
}