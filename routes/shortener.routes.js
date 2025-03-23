import path from "path";

import { postURLShortener, getURLShortener, redirectToShortLink } from "../controllers/post.shortener.controller.js";

// import express from "express";
// const router = express.Router();

//instance bana liya, jisse Router() obj ki saari power propertoes humne is variable router ko dediya
import { Router } from "express";
const router = Router();

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
    { name: "viki2", grade: "11th", favoriteSubject: "Moths" },
    { name: "viki2", grade: "11th", favoriteSubject: "Moths" },
    { name: "viki2", grade: "11th", favoriteSubject: "Moths" },
    { name: "viki2", grade: "11th", favoriteSubject: "Moths" }
    ];

    return res.render("report", {student} );
});

router.get("/", getURLShortener);

router.get("/:shortcode", redirectToShortLink);

//controller ko create krna ka mtlb- first creating router(router ka kaam mtlb ek road banadi- and ab jb b koi is route p hit krega using POST method tab ye function call kro) -then creatinf  postURLShortener----- // why useing controller or other - kyuki rasta dikhana h dukane ghr nhi dikhane na

router.post("/", postURLShortener)

router.use((req, res) => {
    return res.status(404).sendFile(path.join("views", "404.html"));
    // res.status(404).send(`<h1>404 Page Not Found</h1>`);
})

// Deafult export
// export default router;

// Named export
export const shortenerRouters= router;