import { promisify } from "util";
import { createPool } from "mysql";

export const makeDb = () => {
    var pool = createPool({
        connectionLimit: 20,
        host: process.env.GUESTS_DB_HOST,
        user: process.env.GUESTS_DB_USER,
        password: process.env.GUESTS_DB_PWD,
        database: process.env.GUESTS_DB_NAME,
        });
        return {
        query( sql: string, args: any[] ) {
            return promisify( pool.query )
            .call( pool, sql, args );
        },
        close() {
            return promisify( pool.end ).call( pool );
        }
    };
}