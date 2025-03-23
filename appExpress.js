import {shortenerRouters} from "./routes/shortener.routes.js"

import path from "path";

import express from "express";
const app = express();

const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

const staticFile = path.join(import.meta.dirname, "public")
app.use(express.static(staticFile));

// In express.js, a template engine is a tool that lets you embed dynamic content into HTML files and resnder them on the server before sending them to client. It allows you to create reusable templates making it wasier to genarte dynamic web pages with minimal code

app.set("view engine", "ejs");
// app.set("views", "./views");

// express router
app.use(shortenerRouters);

app.listen(PORT, () => {
    console.log(`Server is running at port: ${PORT}`);
})
