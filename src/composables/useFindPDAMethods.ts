import * as anchor from "@project-serum/anchor";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { numberToLEBytes } from "@/composables/useAuxFunctions"


export const findPDAforHighRank = async (programId: anchor.web3.PublicKey, wallet: any): Promise<anchor.web3.PublicKey> => {

  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("highRank"), wallet.value.publicKey.toBytes()],
    programId
  );

  return pda;

}

export const findPDAforProfessor = async (programId: anchor.web3.PublicKey, wallet: any): Promise<anchor.web3.PublicKey> => {

  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("professor"), wallet.value.publicKey.toBytes()],
    programId
  );

  return pda;
}

export const findPDAforStudent = async (programId: anchor.web3.PublicKey, wallet: any): Promise<anchor.web3.PublicKey> => {

  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("student"), wallet.value.publicKey.toBytes()],
    programId
  );
  return pda;
}

export const findPDAforIdGenerator = async (programId: anchor.web3.PublicKey, account_info: string): Promise<anchor.web3.PublicKey> => {
  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode(account_info + 'IdHandler')],
    programId
  );
  return pda;
}

export const findPDAforProposalIdGenerator = async (programId: anchor.web3.PublicKey, is_professor: boolean, subject_code: number): Promise<anchor.web3.PublicKey> => {

  let adding: string;
  if (is_professor) { adding = 'professorP' } else { adding = 'p' }
  const identifier: string = adding + 'roposalIdHandler';

  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode(identifier), numberToLEBytes(subject_code)],
    programId
  );
  return pda;
}

export const findPDAforFaculty = async (programId: anchor.web3.PublicKey, id: number): Promise<anchor.web3.PublicKey> => {
 
  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("faculty"), numberToLEBytes(id)],
    programId
  );
  return pda;
}

export const findPDAforDegree = async (programId: anchor.web3.PublicKey, id: number): Promise<anchor.web3.PublicKey> => {
  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("degree"), numberToLEBytes(id)],
    programId
  );
  return pda;
}

export const findPDAforSpecialty = async (programId: anchor.web3.PublicKey, id: number): Promise<anchor.web3.PublicKey> => {
  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("specialty"), numberToLEBytes(id)],
    programId
  );
  return pda;
}

export const findPDAforSubject = async (programId: anchor.web3.PublicKey, id: number): Promise<anchor.web3.PublicKey> => {
  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("subject"), numberToLEBytes(id)],
    programId
  );
  return pda;
}

export const findPDAforProposal = async (programId: anchor.web3.PublicKey, id: number, subject_code: number): Promise<anchor.web3.PublicKey> => {
  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("proposal"), numberToLEBytes(id), numberToLEBytes(subject_code)],
    programId
  );
  return pda;
}

export const findPDAforProfessorProposal = async (programId: anchor.web3.PublicKey, id: number, subject_code: number): Promise<anchor.web3.PublicKey> => {
  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("professorProposal"), numberToLEBytes(id), numberToLEBytes(subject_code)],
    programId
  );
  return pda;
}

export const findPDAforMint = async (programId: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("creditToken")],
    programId
  );
  return pda;
}

export const findPDAforCodeIdRelation = async (programId: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("codeIdSubjectRelation")],
    programId
  );
  return pda;
}

export const findPDAforSystemInitialization = async (programId: anchor.web3.PublicKey): Promise<anchor.web3.PublicKey> => {
  const [pda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("systemInitialization")],
    programId
  );
  return pda;
}

export const findPDAforMintAuthority = async (programId: anchor.web3.PublicKey, mint: anchor.web3.PublicKey, high_rank_identifier_code: string): Promise<[anchor.web3.PublicKey, number]> => {
  const [pda, bump] = anchor.web3.PublicKey.findProgramAddressSync(
    [utf8.encode("mint_authority"), mint.toBytes(), utf8.encode(high_rank_identifier_code)],
    programId
  );
  return [pda, bump]
}