module.exports = (apiKey) => {
   const key = apiKey ? apiKey : process.env.BT_API_KEY;
   if(key === undefined) {
       throw new Error("Basis Theory API Key required - either pass apiKey or set BT_API_KEY environment variable")
   }
   
   return key;
}