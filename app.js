import { readFile, writeFile } from "fs/promises";
import { createServer } from "http";
import path from "path";
import crypto from "crypto";
import { json } from "stream/consumers";

const PORT = 3000;
const DATA_FILE = path.join("data", "links.json");

const loadLinks = async () => {
    try {
        const data = await readFile(DATA_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        if (error.code === "ENOENT") {
            await writeFile(DATA_FILE, JSON.stringify({}));  //empty object create krenge n willConvertToJSON
            return {};
        }
    }
    throw error;
}

const saveLinks = async (links) => {
    await writeFile(DATA_FILE, JSON.stringify(links));
}

const server = createServer(async (req, res) => {
    // console.log(req.url); //isse pata chlta h ki index load nhi hua
    if (req.method === "GET") {
        if (req.url === "/links") {
            const links = await loadLinks();

            res.writeHead(200, { 'Content-Type': "application/json" });
            return res.end(JSON.stringify(links));
        } 

        // Add redirection logic here
        const links = await loadLinks(); // Load the links object
        const shortcode = req.url.slice(1); // Remove the leading slash (e.g., "/yo" → "yo")

        if (links[shortcode]) {
            // If the shortcode exists, redirect to the corresponding URL
            res.writeHead(302, { "Location": links[shortcode] });
            return res.end();
        }

        // Serve static files (e.g., index.html, CSS, JS)
        const filePath = path.join("public", req.url === "/" ? "index.html" : req.url);
        try {
            const data = await readFile(filePath);
    
            const extName = path.extname(filePath);
            let contentType = "text/html";
            if (extName === ".css") contentType = "text/css";
            else if (extName === ".js") contentType = "text/javascript";
    
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        } catch (error) {
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end("404 Page Not Found");
        }
    }

    //phle frontend ne kisine request ki URL ki- /links path pe- means is particularly api ko call kiya- call krte hi links.josn ka data frontend ko pass krke one by one display kraana h
    // else if (req.method === "GET" && req.url === "/links") {
    //     const links = await loadLinks();

    //     res.writeHead(200, { 'Content-Type': "application/json" });
    //     return res.end(JSON.stringify(links));
    // }

    if (req.method === "POST" && req.url === "/shorten") {
        const links = await loadLinks();

        let body = "";
        //jab tak server aapko data de rha h tab tak ye wala event trigger/listen hoga fir end wala event
        req.on("data", (chunk) => { //request.on wala event
            body += chunk;
        });
        req.on('end', async () => {
            console.log(body);
            const { url, shortcode } = JSON.parse(body);

            if (!url) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end("URL is required");
            }

            const finalShortCode = shortcode || crypto.randomBytes(4).toString("hex");

            if (links[finalShortCode]) {
                res.writeHead(400, { "Content-Type": "text/plain" });
                return res.end("Short code already exists. Please choose another.");
            }

            links[finalShortCode] = url;
            await saveLinks(links);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, shortcode: finalShortCode }));
        });
    }
});
/*
JSON.parse():-
A common use of JSON is to exchange data to/from a web server.
When receiving data from a web server, the data is always a string.
Parse the data with JSON.parse(), and the data becomes a JavaScript object.

JSON.stringify():-
A common use of JSON is to exchange data to/from a web server.
When sending data to a web server, the data has to be a string.
You can convert any JavaScript datatype into a string with JSON.stringify()

.json():-
The .json() method reads the response stream and parses it into a JavaScript object.
It returns a Promise that resolves to the parsed JSON data.
*/

server.listen(PORT, () => {
    console.log(`Server Running🔥🔥 at http://localhost:${PORT}`);
})

//kese data GET or kese apne server k file me usko store kr skte ho

