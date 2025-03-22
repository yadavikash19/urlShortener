import fs, { readFile, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import express from "express";
const app = express();

const PORT = 3000;
const DATA_FILE = path.join("data", "links.json");

app.use(express.urlencoded({ extended: true }));


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

const staticFile = path.join(import.meta.dirname, "public")
app.use(express.static(staticFile));

app.get("/", async (req, res) => {
    try {
        const file = await fs.readFile(path.join(import.meta.dirname, "views", "index.html"));
        const links = await loadLinks();

        // Replace {{ shortened_urls }} with the list of shortened URLs
        const shortenedURLs = Object.entries(links).map(
            ([shortcode, url]) => {
                const truncatedURL = url.length >= 30 ? `${url.slice(0, 30)}...` : url;
                return `<li><a href="/${shortcode}" target="_blank">${req.host}/${shortcode}</a> - ${truncatedURL}</li>`;
            }
        ).join("");

        // Replace {{ error }} with an empty string (no error by default)
        const content = file.toString()
            .replace("{{ shortened_urls }}", shortenedURLs)
            .replace("{{ error }}", ""); // No error by default
        /*
        const content= file.toString().replaceAll(
            "{{ shortened_urls }}",
            Object.entries(links).map(
                ([shortcode,url])=> {
                    const truncatedURL= url.length >=30 ? `${url.slice(0,30)}...`: url;
                    return `<li><a href="/${shortcode}" target="_blank"> ${req.host}/${shortcode}</a> - ${truncatedURL}</li>`
                }
                ).join("")
        );
        */
        return res.send(content);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
});

app.get("/:shortcode", async (req, res) => {
    try {
        const { shortcode } = req.params;
        const links = await loadLinks();

        if (!links[shortcode]) return res.status(404).send("404 error occured");

        return res.redirect(links[shortcode]);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
})

app.post("/", async (req, res) => {
    try {
        const { url, shortcode } = req.body;

        const links = await loadLinks();
        const finalShortCode = shortcode || crypto.randomBytes(4).toString("hex");

        if (links[finalShortCode]) {
            const file = await fs.readFile(path.join(import.meta.dirname, "views", "index.html"));

            const shortenedURLs = Object.entries(links).map(
                ([shortcode, url]) => {
                    const truncatedURL = url.length >= 30 ? `${url.slice(0, 30)}...` : url;
                    return `<li><a href="/${shortcode}" target="_blank">${req.host}/${shortcode}</a> - ${truncatedURL}</li>`;
                }
            ).join("");

            const content = file.toString()
                .replace("{{ shortened_urls }}", shortenedURLs)
                .replace("{{ error }}", `<div class="alert error">Short code already exists. Please choose another.</div>`);

            return res.status(400).send(content);

            // return res.status(400).send("Short code already exists. Please choose another.");
        }

        links[finalShortCode] = url;
        await saveLinks(links);
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
})

app.use((req, res) => {
    return res.status(404).sendFile(path.join(import.meta.dirname, "views", "404.html"));
    // res.status(404).send(`<h1>404 Page Not Found</h1>`);
})

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
})
