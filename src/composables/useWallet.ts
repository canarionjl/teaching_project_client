import { computed } from "vue";
import { AnchorWallet, useAnchorWallet, useWallet } from "solana-wallets-vue";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Idl, Program } from "@project-serum/anchor";

import idl from '@/program/idl/teaching_project_handler.json'
import { RefSymbol } from "@vue/reactivity";

const preflightCommitment = "processed";
const commitment = "confirmed";
const programID = new PublicKey(idl.metadata.address);

let workspace: any;

export const useWorkspace = () => workspace;

export const initWorkspace = () => {

  const anchorWallet:any = useAnchorWallet();
  
  const solanaWallet = useWallet();

  const connection = new Connection("http://localhost:8899", commitment);

  const provider = computed (
    () =>
      new AnchorProvider(connection, anchorWallet.value, {
        preflightCommitment,
        commitment,
      })
  );

  const program = computed(
    () => new Program (idl as Idl, programID, provider.value))
;

  workspace = {
    anchorWallet,
    solanaWallet,
    connection,
    provider,
    program
  };

};