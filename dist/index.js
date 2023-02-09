"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaInspector = void 0;
function SchemaInspector(knex) {
    var constructor;
    switch (knex.client.constructor.name) {
        case 'Client_MySQL':
        case 'Client_MySQL2':
            constructor = require('./dialects/mysql').default;
            break;
        case 'Client_PG':
            constructor = require('./dialects/postgres').default;
            break;
        case 'Client_CockroachDB':
            constructor = require('./dialects/cockroachdb').default;
            break;
        case 'Client_SQLite3':
        case 'Client_BetterSQLite3':
            constructor = require('./dialects/sqlite').default;
            break;
        case 'Client_Oracledb':
        case 'Client_Oracle':
            constructor = require('./dialects/oracledb').default;
            break;
        case 'Client_MSSQL':
            constructor = require('./dialects/mssql').default;
            break;
        default:
            throw Error('Unsupported driver used: ' + knex.client.constructor.name);
    }
    return new constructor(knex);
}
exports.SchemaInspector = SchemaInspector;
exports.default = SchemaInspector;
