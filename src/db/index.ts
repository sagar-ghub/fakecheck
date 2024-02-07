import { DataSource } from "typeorm"

export const myDataSource = new DataSource({
    type: "postgres",
    // host: process.env.HOST,
    // port: 5432,
    // username: process.env.USERNAME,
    // password: process.env.PASSWORD,
    // database: process.env.DB,
    url:"postgres://root:2iOxyW8qcgjtEmoZ3jAnES08XAz10Xcp@dpg-cn1tgbicn0vc73cqoln0-a.singapore-postgres.render.com/employee_aqvm"+"?ssl=true",//It will die after some days
    entities: ["src/entity/*.js"],
    logging: false,
    synchronize: true,
})
