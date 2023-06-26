
import { defineStore } from 'pinia';
import CryptoJS from 'crypto-js';
import { useLocalStorage } from "@vueuse/core"


export const useAuthStore = defineStore('authCode', {

  state: () => {

    return {

      authCode: useLocalStorage('authCode', '0000')

    }
    
  },

  getters: {

    hashedAuthCode: (authCode) => CryptoJS.SHA256(authCode.authCode)

  },

  actions: {

    setAuthCode(code: string) {

      if (code != "1111" && code != "2222" && code != "3333") {
        this.authCode = "0000"
      } else {
        console.log(code)
        this.authCode = code
      }

    }

  }

})



