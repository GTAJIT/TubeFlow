import {atom } from "recoil";

const userIdContext = atom({
    key: "userIdContext",
    default: ""
})
export {
    userIdContext
}