const fetchShortenedURL= async ()=>{
    const response= await fetch("/links");
    const links = await response.json();
    console.log("links: ",links);

    const list= document.getElementById("shortened-links");
    list.innerHTML="";

    for (const [shortcode,url] of Object.entries(links)) {
        const li= document.createElement("li");
        const truncatedURL= url.length >=30 ? `${url.slice(0,30)}...`: url;

        li.innerHTML= `<a href="/${shortcode}" target="_blank"> ${window.location.origin}/${shortcode}</a> - ${truncatedURL}`;
        list.appendChild(li);
    }
}

document.querySelector("#shorten-form").addEventListener("submit",async (event)=>{
    event.preventDefault();
    
    const formData= new FormData(event.target);
    const url= formData.get("url");
    const shortcode= formData.get("shortcode");
    console.log(url, shortcode);
    
    try {
        const response= await fetch("/shorten", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({url,shortcode}) //ye wo jgh h jaha pe aapke data ko kroge share- //error- Send data as an object
        });
        
        if(response.ok) {
            fetchShortenedURL();
            alert("Form subitted succesfully");
        }
        else{
            const errorMessage= await response.text();
            alert(errorMessage);
        }
    } catch (error) {
        console.log(error);
    }
    
    event.target.reset();
});

fetchShortenedURL();


