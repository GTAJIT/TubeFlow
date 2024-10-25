import { jwtDecode } from "jwt-decode"
const isAuthenticated = ()=>{
    try {
        const token = localStorage.getItem('token')
        if(!token) return false;
        const decode = jwtDecode(token)
        const currentTime = Date.now()
        if(decode.exp && decode.exp< currentTime){
            localStorage.removeItem('token')
            return false;
        }
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export default isAuthenticated