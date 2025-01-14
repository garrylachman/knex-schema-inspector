"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDefaultValue = exports.rawColumnToColumn = void 0;
var strip_quotes_1 = require("../utils/strip-quotes");
function rawColumnToColumn(rawColumn) {
    var _a;
    var dataType = rawColumn.COLUMN_TYPE.replace(/\(.*?\)/, '');
    if (rawColumn.COLUMN_TYPE.startsWith('tinyint(1)')) {
        dataType = 'boolean';
    }
    return {
        name: rawColumn.COLUMN_NAME,
        table: rawColumn.TABLE_NAME,
        data_type: dataType,
        default_value: parseDefaultValue(rawColumn.COLUMN_DEFAULT),
        generation_expression: rawColumn.GENERATION_EXPRESSION || null,
        max_length: rawColumn.CHARACTER_MAXIMUM_LENGTH,
        numeric_precision: rawColumn.NUMERIC_PRECISION,
        numeric_scale: rawColumn.NUMERIC_SCALE,
        is_generated: !!((_a = rawColumn.EXTRA) === null || _a === void 0 ? void 0 : _a.endsWith('GENERATED')),
        is_nullable: rawColumn.IS_NULLABLE === 'YES',
        is_unique: rawColumn.COLUMN_KEY === 'UNI',
        is_primary_key: rawColumn.CONSTRAINT_NAME === 'PRIMARY' || rawColumn.COLUMN_KEY === 'PRI',
        has_auto_increment: rawColumn.EXTRA === 'auto_increment',
        foreign_key_column: rawColumn.REFERENCED_COLUMN_NAME,
        foreign_key_table: rawColumn.REFERENCED_TABLE_NAME,
        comment: rawColumn.COLUMN_COMMENT,
    };
}
exports.rawColumnToColumn = rawColumnToColumn;
function parseDefaultValue(value) {
    if (value === null || value.trim().toLowerCase() === 'null')
        return null;
    return (0, strip_quotes_1.stripQuotes)(value);
}
exports.parseDefaultValue = parseDefaultValue;
var MySQL = /** @class */ (function () {
    function MySQL(knex) {
        this.knex = knex;
    }
    // Tables
    // ===============================================================================================
    /**
     * List all existing tables in the current schema/database
     */
    MySQL.prototype.tables = function () {
        return __awaiter(this, void 0, void 0, function () {
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .select('TABLE_NAME')
                            .from('INFORMATION_SCHEMA.TABLES')
                            .where({
                            TABLE_TYPE: 'BASE TABLE',
                            TABLE_SCHEMA: this.knex.client.database(),
                        })];
                    case 1:
                        records = _a.sent();
                        return [2 /*return*/, records.map(function (_a) {
                                var TABLE_NAME = _a.TABLE_NAME;
                                return TABLE_NAME;
                            })];
                }
            });
        });
    };
    MySQL.prototype.tableInfo = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rawTable, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .select('TABLE_NAME', 'ENGINE', 'TABLE_SCHEMA', 'TABLE_COLLATION', 'TABLE_COMMENT')
                            .from('information_schema.tables')
                            .where({
                            table_schema: this.knex.client.database(),
                            table_type: 'BASE TABLE',
                        });
                        if (!table) return [3 /*break*/, 2];
                        return [4 /*yield*/, query
                                .andWhere({ table_name: table })
                                .first()];
                    case 1:
                        rawTable = _a.sent();
                        return [2 /*return*/, {
                                name: rawTable.TABLE_NAME,
                                schema: rawTable.TABLE_SCHEMA,
                                comment: rawTable.TABLE_COMMENT,
                                collation: rawTable.TABLE_COLLATION,
                                engine: rawTable.ENGINE,
                            }];
                    case 2: return [4 /*yield*/, query];
                    case 3:
                        records = _a.sent();
                        return [2 /*return*/, records.map(function (rawTable) {
                                return {
                                    name: rawTable.TABLE_NAME,
                                    schema: rawTable.TABLE_SCHEMA,
                                    comment: rawTable.TABLE_COMMENT,
                                    collation: rawTable.TABLE_COLLATION,
                                    engine: rawTable.ENGINE,
                                };
                            })];
                }
            });
        });
    };
    /**
     * Check if a table exists in the current schema/database
     */
    MySQL.prototype.hasTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .count({ count: '*' })
                            .from('information_schema.tables')
                            .where({
                            table_schema: this.knex.client.database(),
                            table_name: table,
                        })
                            .first()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result && result.count === 1) || false];
                }
            });
        });
    };
    // Columns
    // ===============================================================================================
    /**
     * Get all the available columns in the current schema/database. Can be filtered to a specific table
     */
    MySQL.prototype.columns = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var query, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .select('TABLE_NAME', 'COLUMN_NAME')
                            .from('INFORMATION_SCHEMA.COLUMNS')
                            .where({ TABLE_SCHEMA: this.knex.client.database() });
                        if (table) {
                            query.andWhere({ TABLE_NAME: table });
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        records = _a.sent();
                        return [2 /*return*/, records.map(function (_a) {
                                var TABLE_NAME = _a.TABLE_NAME, COLUMN_NAME = _a.COLUMN_NAME;
                                return ({
                                    table: TABLE_NAME,
                                    column: COLUMN_NAME,
                                });
                            })];
                }
            });
        });
    };
    MySQL.prototype.columnInfo = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rawColumn, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .select('c.TABLE_NAME', 'c.COLUMN_NAME', 'c.COLUMN_DEFAULT', 'c.COLUMN_TYPE', 'c.CHARACTER_MAXIMUM_LENGTH', 'c.IS_NULLABLE', 'c.COLUMN_KEY', 'c.EXTRA', 'c.COLLATION_NAME', 'c.COLUMN_COMMENT', 'c.NUMERIC_PRECISION', 'c.NUMERIC_SCALE', 'c.GENERATION_EXPRESSION', 'fk.REFERENCED_TABLE_NAME', 'fk.REFERENCED_COLUMN_NAME', 'fk.CONSTRAINT_NAME', 'rc.UPDATE_RULE', 'rc.DELETE_RULE', 'rc.MATCH_OPTION')
                            .from('INFORMATION_SCHEMA.COLUMNS as c')
                            .leftJoin('INFORMATION_SCHEMA.KEY_COLUMN_USAGE as fk', function () {
                            this.on('c.TABLE_NAME', '=', 'fk.TABLE_NAME')
                                .andOn('fk.COLUMN_NAME', '=', 'c.COLUMN_NAME')
                                .andOn('fk.CONSTRAINT_SCHEMA', '=', 'c.TABLE_SCHEMA');
                        })
                            .leftJoin('INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS as rc', function () {
                            this.on('rc.TABLE_NAME', '=', 'fk.TABLE_NAME')
                                .andOn('rc.CONSTRAINT_NAME', '=', 'fk.CONSTRAINT_NAME')
                                .andOn('rc.CONSTRAINT_SCHEMA', '=', 'fk.CONSTRAINT_SCHEMA');
                        })
                            .where({
                            'c.TABLE_SCHEMA': this.knex.client.database(),
                        });
                        if (table) {
                            query.andWhere({ 'c.TABLE_NAME': table });
                        }
                        if (!column) return [3 /*break*/, 2];
                        return [4 /*yield*/, query
                                .andWhere({ 'c.column_name': column })
                                .first()];
                    case 1:
                        rawColumn = _a.sent();
                        return [2 /*return*/, rawColumnToColumn(rawColumn)];
                    case 2: return [4 /*yield*/, query];
                    case 3:
                        records = _a.sent();
                        return [2 /*return*/, records
                                .map(rawColumnToColumn)
                                .sort(function (column) { return +!column.foreign_key_column; })
                                .filter(function (column, index, records) {
                                var first = records.findIndex(function (_column) {
                                    return column.name === _column.name && column.table === _column.table;
                                });
                                return first === index;
                            })];
                }
            });
        });
    };
    /**
     * Check if a table exists in the current schema/database
     */
    MySQL.prototype.hasColumn = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .count('*', { as: 'count' })
                            .from('information_schema.columns')
                            .where({
                            table_schema: this.knex.client.database(),
                            table_name: table,
                            column_name: column,
                        })
                            .first()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, !!(result && result.count)];
                }
            });
        });
    };
    /**
     * Get the primary key column for the given table
     */
    MySQL.prototype.primary = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex.raw("SHOW KEYS FROM ?? WHERE Key_name = 'PRIMARY'", table)];
                    case 1:
                        results = _a.sent();
                        if (results && results.length && results[0].length) {
                            return [2 /*return*/, results[0][0]['Column_name']];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    // Foreign Keys
    // ===============================================================================================
    MySQL.prototype.foreignKeys = function (table) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.knex.raw("\n      SELECT DISTINCT\n        rc.TABLE_NAME AS 'table',\n        kcu.COLUMN_NAME AS 'column',\n        rc.REFERENCED_TABLE_NAME AS 'foreign_key_table',\n        kcu.REFERENCED_COLUMN_NAME AS 'foreign_key_column',\n        rc.CONSTRAINT_NAME AS 'constraint_name',\n        rc.UPDATE_RULE AS on_update,\n        rc.DELETE_RULE AS on_delete\n      FROM\n        information_schema.referential_constraints AS rc\n      JOIN information_schema.key_column_usage AS kcu ON\n        rc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME\n        AND kcu.CONSTRAINT_SCHEMA = rc.CONSTRAINT_SCHEMA\n      WHERE\n        rc.CONSTRAINT_SCHEMA = ?;\n    ", [this.knex.client.database()])];
                    case 1:
                        result = _b.sent();
                        // Mapping casts "RowDataPacket" object from mysql to plain JS object
                        if (table) {
                            return [2 /*return*/, (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a.filter(function (row) { return row.table === table; }).map(function (row) { return (__assign({}, row)); })];
                        }
                        return [2 /*return*/, result === null || result === void 0 ? void 0 : result[0].map(function (row) { return (__assign({}, row)); })];
                }
            });
        });
    };
    return MySQL;
}());
exports.default = MySQL;
