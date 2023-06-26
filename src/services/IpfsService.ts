import ipfs from "@/composables/useIPFS"

class IpfsService {

    async uploadFileToIPFS (file: File) {
        
        const result = await ipfs.add(file)
        return result.path

    }

    watchTeachingProject(reference: string) {
        window.open (`https://cloudflare-ipfs.com/ipfs/${reference}`, '_blank')
    }

}

export default IpfsService