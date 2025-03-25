// import { readFile, writeFile } from "fs/promises";
// import path from "path";

// const DATA_FILE = path.join("data", "links.json");

// //In modal- we deal with data

// export const loadLinks = async () => {
//     try {
//         const data = await readFile(DATA_FILE, "utf-8");
//         return JSON.parse(data);
//     } catch (error) {
//         if (error.code === "ENOENT") {
//             await writeFile(DATA_FILE, JSON.stringify({}));  //empty object create krenge n willConvertToJSON
//             return {};
//         }
//     }
//     throw error;
// }

// export const saveLinks = async (links) => {
//     await writeFile(DATA_FILE, JSON.stringify(links));
// }

// import { dbClient } from "../config/db-client.js";
// import { env } from "../config/env.js";

// const db= dbClient.db(env.MONGODB_DATABASE_NAME);
// const shortenerCollection= db.collection("shorteners");
import { db_mysql } from "../config/db-client.js";

export const loadLinks= async () => {
    // return shortenerCollection.find().toArray(); //Converting to mysql
    const [rows]= await db_mysql.execute('select * from short_links');
    return rows;
};

export const saveLinks= async (link) => {
    // return shortenerCollection.insertOne(link); //Converting to mysql
    const [result] = await db_mysql.execute("insert into short_links (shortcode,url) values (?,?)",[
        link.shortcode,
        link.url,

    ]);
    return result;
};

export const getLinkByShortCode = async (shortCode) => {
    // return await shortenerCollection.findOne({shortcode: shortCode}); //Converting to mysql
    const [rows]= await  db_mysql.execute("select * from short_links where shortcode = ?",[shortCode]);

    if (rows.length>0){
        return rows[0];
    } else {
        return null;
    }
};