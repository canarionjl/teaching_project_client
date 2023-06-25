<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light main-navbar">

      <div class="container-fluid p-2">

        <div class="d-flex flex-row justify-content-lg-start flex-wrap">

          <a href="/">
            <img src="@/assets/logo.png" id="logo" alt="Logo de la Universidad de Las Palmas de Gran Canaria">
          </a>

        </div>

        <div class="d-flex flex-row justify-content-lg-end flex-wrap pe-4">

          <button type="button" id="registerButton" class="btn btn-primary px-3 py-2 me-4">

            <i class="bi bi-person-add pe-2"> </i> Registrarse

          </button>

          <button type="button" id="loginButton" class="btn btn-primary px-3 py-2 me-4">

            <i class="bi bi-person-fill pe-2"> </i> Iniciar sesión

          </button>

          <wallet-multi-button> </wallet-multi-button>

        </div>

      </div>

    </nav>

  </div>

  <router-view />
  <br><br>
</template>



<script lang="ts" setup>

import { WalletMultiButton } from "solana-wallets-vue";

import { initWorkspace } from './composables/useWallet';
import { initWallet } from "solana-wallets-vue";
import { walletOptions } from '@/composables/useInitWallet';

initWallet(walletOptions);
initWorkspace();

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
