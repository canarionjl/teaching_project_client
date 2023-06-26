import { create } from 'ipfs-http-client'
import {Buffer} from 'buffer'

const projectId = '2RQa2kB9qasSEKPRefUhMIytIV5'
const projectSecret = '4abe9299d366f9808a2e5408cd4e15ec'

const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    timeout: 10000,
    headers: {
        authorization: auth
    }
})

export default ipfs