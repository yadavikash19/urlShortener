import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const loadLinks= async () => {
    // const [rows]= await db_mysql.execute('select * from short_links');
    // return rows;

    const allShortLinks= await prisma.shortLink.findMany();
    return allShortLinks;
};

export const getLinkByShortCode = async (shortCode) => {
    // const [rows]= await  db_mysql.execute("select * from short_links where shortcode = ?",[shortCode]);

    const shortLink= await prisma.shortLink.findUnique({
        where: {shortCode : shortCode},
    });
    return shortLink;
};

export const saveLinks= async (link) => {
    // const [result] = await db_mysql.execute("insert into short_links (shortcode,url) values (?,?)",[
    //     link.shortcode,
    //     link.url,

    // ]);
    // return result;

    const newShortLink = await prisma.shortLink.create({
        data: {shortCode: link.shortcode, url:link.url},
    });
    return newShortLink;
};