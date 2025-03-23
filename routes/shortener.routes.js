import crypto from "crypto";
import fs, { readFile, writeFile } from "fs/promises";
import path from "path";

// import express from "express";
// const router = express.Router();

//instance bana liya, jisse Router() obj ki saari power propertoes humne is variable router ko dediya
import { Router } from "express";
const router = Router();

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

router.get("/report", (req, res) => {
    const student = [{
        name: "viki",
        grade: "10th",
        favoriteSubject: "Maths"
    },
    { name: "viki2", grade: "11th", favoriteSubject: "Moths" },
    { name: "viki2", grade: "11th", favoriteSubject: "Moths" },
    { name: "viki2", grade: "11th", favoriteSubject: "Moths" },
    { name: "viki2", grade: "11th", favoriteSubject: "Moths" },
    { name: "viki2", grade: "11th", favoriteSubject: "Moths" }
    ];

    return res.render("report", {student} );
});

router.get("/", async (req, res) => {
    try {
        const file = await fs.readFile(path.join("views", "index.html"));
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

router.get("/:shortcode", async (req, res) => {
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

router.post("/", async (req, res) => {
    try {
        const { url, shortcode } = req.body;

        const links = await loadLinks();
        const finalShortCode = shortcode || crypto.randomBytes(4).toString("hex");

        if (links[finalShortCode]) {
            const file = await fs.readFile(path.join("views", "index.html"));

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

router.use((req, res) => {
    return res.status(404).sendFile(path.join("views", "404.html"));
    // res.status(404).send(`<h1>404 Page Not Found</h1>`);
})

export default router;