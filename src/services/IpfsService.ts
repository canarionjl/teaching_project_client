import ipfs from "@/composables/useIPFS"

class IpfsService {

    async uploadFileToIPFS (file: File) {

        const result = ipfs.add(file)
        console.log(result)

    }



}

export default IpfsService