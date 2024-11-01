import {atom } from "recoil";

const userIdContext = atom({
    key: "authState",
    default: ""
})
export {
    userIdContext
}