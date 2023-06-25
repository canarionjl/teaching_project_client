import { TeachingProjectHandler } from "@/program/types/teaching_project_handler";
import { Program } from "@project-serum/anchor";
import { useWorkspace } from "./useWallet";
import { countReset } from "console";
import * as Borsh from 'borsh';
import { useAuthStore } from "@/store/authCodeStore";
import UserService from "@/services/UserService";



export function numberToLEBytes(param: number): Uint8Array {
  const buffer = new ArrayBuffer(4);
  const view = new DataView(buffer);
  view.setUint32(0, param, true);
  const bytes = new Uint8Array(buffer);
  return bytes;
}




export const getCourse = async (course: number) => {

  if (course > 9) return 0;

  const { program } = useWorkspace()

  const courseIdl = program.value.idl.types[4].type.variants[course]
  const course_lowercase = courseIdl.name.toLowerCase()
  const course_object = { [course_lowercase]: {} }

  return course_object
}

export function getCourseIndex(courseObject: any): string {

  const { program } = useWorkspace()
  const courseIdl = program.value.idl.types[4].type.variants

  const stringProperty = Object.keys(courseObject)[0]
  const stringPropertyCapitalized = stringProperty.charAt(0).toUpperCase() + stringProperty.slice(1);
  const idlObject = { name: stringPropertyCapitalized }

  const index = courseIdl.findIndex((x: { name: string }) => x.name == idlObject.name)

  if (index == 0) {
    return "No definido"
  } else {
    return index.toString()
  }

}

export const courseList = ["Todos", "1º", "2º", "3º", "4º", "5º", "6º", "7º", "8º", "9º"]





export function validateInputText(max_lengh: number, text: string): [boolean, string] {

  let isValid = true
  let errorMessage = ""

  if (!text || text == null) {
    isValid = false
    errorMessage = "Debe introducir un valor para completar el formulario correctamente"
  }
  else if (text.length < 5) {
    isValid = false
    errorMessage = "El valor introducido debe tener al menos cinco caracteres"
  }

  else if (text.length > max_lengh) {
    isValid = false
    errorMessage = "El valor introducido debe tener menos de " + max_lengh + " caracteres"
  }

  return [isValid, errorMessage]

}

export function validateIdSelect(id: number) {

  let isValid = true
  let errorMessage = ""

  if (id <= 0) {
    isValid = false;
    errorMessage = "No ha seleccionado ningún valor o el valor seleccionado es incorrecto"
  }

  return [isValid, errorMessage]
}

export function validateSubjectCode(code: string) {

  let isValid = true
  let errorMessage = ""

  if (!code || code == null) {
    isValid = false
    errorMessage = "Debe introducir un valor para completar el formulario correctamente"
  }

  const number = Number(code)
  const limit = Math.pow(2, 32) - 1

  if (Number.isNaN(number)) {
    isValid = false;
    errorMessage = "El código solo debe contener caracteres numéricos"
  }

  if (number < 0 || number > limit) {
    isValid = false;
    errorMessage = "El código debe ser un número entre 0 y 4.294.967.295"
  }

  return [isValid, errorMessage]
}





const getReturnLog = (confirmedTransaction: any) => {

  const prefix = "Program return: ";
  let log = confirmedTransaction.meta.logMessages.find((log: any) =>
    log.startsWith(prefix)
  );
  log = log.slice(prefix.length);
  const [key, data] = log.split(" ", 2);
  const buffer = Buffer.from(data, "base64");
  return [key, data, buffer];
};

export async function getReturn(isBoolean: boolean, isString: boolean, tx: any) {

  const { connection } = useWorkspace()

  console.log(connection)

  await connection.confirmTransaction(tx.toString())
  const transaction = await connection.getTransaction(tx.toString(), { commitment: "confirmed" });

  console.log(transaction)

  const [key, data, buffer] = getReturnLog(transaction)

  if (isBoolean) {
    const reader_U8 = new Borsh.BinaryReader(buffer).readU8;
    return Boolean(reader_U8);
  }

  else if (isString) {
    const reader_String = new Borsh.BinaryReader(buffer).readString;
    return String(reader_String);
  }

  else {
    return null;
  }

}


export function getArrayLength(array: []) {
    return array.length
}



export function convertUnixTimestampToDate(unixTimestamp: number): string {

  const date = new Date(unixTimestamp * 1000); 

  const day = date.getDate();
  const month = date.getMonth() + 1; 
  const year = date.getFullYear();

  const formattedDay = day.toString().padStart(2, '0');
  const formattedMonth = month.toString().padStart(2, '0');

  return `${formattedDay}/${formattedMonth}/${year}`;

}


export function getProposalState (stateObject: any) {

  const state = Object.keys(stateObject)[0]
  const capitalized_state = state.charAt(0).toUpperCase() + state.slice(1);

  return capitalized_state

}


export async function getUserInfo(): Promise<[boolean, any]> {

  const {hashedAuthCode} = useAuthStore()
  
  if (hashedAuthCode.toString() == "edee29f882543b956620b26d0ee0e7e950399b1c4222f5de05e06425b4c995e9") {
      const user: any = await new UserService().fetchProfessorAccountForWallet()
      return [true, user]
  }

  else if (hashedAuthCode.toString() == "318aee3fed8c9d040d35a7fc1fa776fb31303833aa2de885354ddf3d44d8fb69") {
      const user: any = await new UserService().fetchStudentAccountForWallet()
      return [false, user]
  }

  return [false, null];

}

