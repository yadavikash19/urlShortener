import crypto from "crypto";
import fs,{ readFile, writeFile } from "fs/promises";
import path from "path";

import { loadLinks, saveLinks } from "../models/shortener.models.js";

//To yha pe function creating- OR Controller folder me jake define kroge
//Controller ka kaam- to deal with modal n view

export const getURLShortener = async (req, res) => {
    try {
        // const file = await fs.readFile(path.join("views", "index.html"));
        const links = await loadLinks();

        return res.render("index", {links, host: req.host, error: "Please enter your URL & shortCode" });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const postURLShortener= async (req, res) => {
    try {
        const { url, shortcode } = req.body;

        const links = await loadLinks();
        const finalShortCode = shortcode || crypto.randomBytes(4).toString("hex");

        if (links[finalShortCode]) {
            // const file = await fs.readFile(path.join("views", "index.ejs"));

            return res.status(400).render("index", {links, host: req.host, error: "Short code already exists. Please choose another." });

            // return res.status(400).send("Short code already exists. Please choose another.");
        }

        links[finalShortCode] = url;
        await saveLinks(links);
        return res.redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};

export const redirectToShortLink= async (req, res) => {
    try {
        const { shortcode } = req.params;
        const links = await loadLinks();

        if (!links[shortcode]) return res.status(404).send("404 error occured");

        return res.redirect(links[shortcode]);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal server error");
    }
};