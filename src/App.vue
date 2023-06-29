<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light main-navbar">

      <div class="container-fluid p-2">

        <div class="d-flex flex-row justify-content-lg-start flex-wrap">

          <a href="/">
            <img src="@/assets/logo.png" id="logo" alt="Logo de la Universidad de Las Palmas de Gran Canaria">
          </a>

        </div>

        <div class="d-flex flex-row justify-content-lg-end align-items-center flex-wrap pe-4">

          <div v-if="!isLoginRef">

            <router-link :to="{ name: 'login' }">

              <button type="button" id="loginButton" class="btn btn-primary px-3 py-2 me-4">

                <i class="bi bi-person-fill pe-2"> </i> Iniciar Sesión

              </button>

            </router-link>

          </div>

          <div v-else>

            <button type="button" id="unloginButton" @click="closeLogin" class="btn btn-primary px-3 py-2 me-4">

              <i class="bi bi-file-lock2"></i> Cerrar Sesión

            </button>

          </div>

          <router-link :to="{ name: 'register' }">

            <button type="button" id="registerButton" class="btn btn-primary px-3 py-2 me-4">

              <i class="bi bi-person-add pe-2"> </i> Registrarse

            </button>

          </router-link>


          <wallet-multi-button> </wallet-multi-button>

        </div>

      </div>

    </nav>

  </div>

  <router-view />

  <br>
  <br>
</template>



<script lang="ts" setup>

import { WalletMultiButton } from "solana-wallets-vue";

import { initWorkspace } from './composables/useWallet';
import { initWallet } from "solana-wallets-vue";
import { walletOptions } from '@/composables/useInitWallet';
import { ref, Ref } from "vue"
import { useAuthStore } from "./store/authCodeStore";

initWallet(walletOptions);
initWorkspace();

const store = useAuthStore()

let isLoginRef: Ref = ref(store.login)

function closeLogin() {
  store.setLogin(false)
  store.setAuthCode("0000")
  location.reload()
}

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}

#logo {
  height: 125px;
  width: auto;
  object-fit: contain;
  padding-inline: 5%;
}

#loginButton,
#unloginButton,
#registerButton {
  background-color: $complementary !important;
  border: $complementary !important;
  font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
  font-size: 17px;
  font-weight: 600;
}

// Overriding Bootstrap classes
.navbar {
  background-color: $primary !important;
  margin-bottom: 15px !important;
}

.navbar-brand {
  color: white !important;
}

// Overriding Phantom Button Style

.swv-button-trigger {
  background-color: $complementary !important;
}
</style>
