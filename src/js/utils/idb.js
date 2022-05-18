import Dexie from 'dexie'

const DB_NAME = 'titan_db'
const DB_VERSION = 1

const idb = {
    clearTable: ({ table }) => {
        let db = idb.get_db()
        return db[table].clear()
    },
    put: ({ table, data }) => {
        let db = idb.get_db()
        return db[table].put(data)
    },
    get: (table) => {
        let db = idb.get_db()
        return db[table].toArray()
    },
    getIndex: ({ table, index }) => {
        let db = idb.get_db()
        return db[table].get(index)
    },
    update: ({ table, index, data }) => {
        let db = idb.get_db()
        return db[table].update(index, data)
    },

    get_db: () => {
        let db = new Dexie(DB_NAME)
        db.version(DB_VERSION).stores({ configuracion: '++id', })

        return db
    },
}