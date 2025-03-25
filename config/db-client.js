// import { MongoClient } from "mongodb"; 
import { env } from "./env.js";

// export const dbClient= new MongoClient(env.MONGODB_URI);

import mysql from "mysql2/promise";

// 1: to connect to mysql server
export const db_mysql= await mysql.createConnection({
    host: env.DATABASE_HOST,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
})
console.log("MySQL Connected Successfully");