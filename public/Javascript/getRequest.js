async function  GetJSONRequest(url){
    try {
        // get the list of events from the endpoint
        const returnJson = await fetch(url);
        const data = await returnJson.json();
return data;
    }
    catch{
        alert('error');
    }

}




// posts to the server with 
async function PostJSON(url, jsonData) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData)
    });
    const data = await res.json();
    console.log("Server response:", data);
  } catch (err) {
    console.error("POST failed:", err);
  }
}
