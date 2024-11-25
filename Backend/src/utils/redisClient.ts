import {createClient} from 'redis'

const client = createClient({
  url: process.env.REDIS_URL
})
client.on('connect', ()=>{
    console.log("Connected To Redis Server")
});

client.on('error', (err)=>{
    console.log("Redis Error: ", err)
});

(async ()=>{
    try{
        await client.connect();
    }catch(error){
        console.log(error)
    }
})();


export default client;