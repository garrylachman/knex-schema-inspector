"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDefaultValue = void 0;
var lodash_flatten_1 = __importDefault(require("lodash.flatten"));
var extract_max_length_1 = __importDefault(require("../utils/extract-max-length"));
var extract_type_1 = __importDefault(require("../utils/extract-type"));
var strip_quotes_1 = require("../utils/strip-quotes");
function parseDefaultValue(value) {
    if (value === null || value.trim().toLowerCase() === 'null')
        return null;
    return (0, strip_quotes_1.stripQuotes)(value);
}
exports.parseDefaultValue = parseDefaultValue;
var SQLite = /** @class */ (function () {
    function SQLite(knex) {
        this.knex = knex;
    }
    // Tables
    // ===============================================================================================
    /**
     * List all existing tables in the current schema/database
     */
    SQLite.prototype.tables = function () {
        return __awaiter(this, void 0, void 0, function () {
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .select('name')
                            .from('sqlite_master')
                            .whereRaw("type = 'table' AND name NOT LIKE 'sqlite_%'")];
                    case 1:
                        records = _a.sent();
                        return [2 /*return*/, records.map(function (_a) {
                                var name = _a.name;
                                return name;
                            })];
                }
            });
        });
    };
    SQLite.prototype.tableInfo = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var query, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .select('name', 'sql')
                            .from('sqlite_master')
                            .where({ type: 'table' })
                            .andWhereRaw("name NOT LIKE 'sqlite_%'");
                        if (table) {
                            query.andWhere({ name: table });
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        records = _a.sent();
                        records = records.map(function (table) { return ({
                            name: table.name,
                            sql: table.sql,
                        }); });
                        if (table) {
                            return [2 /*return*/, records[0]];
                        }
                        return [2 /*return*/, records];
                }
            });
        });
    };
    /**
     * Check if a table exists in the current schema/database
     */
    SQLite.prototype.hasTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .select(1)
                            .from('sqlite_master')
                            .where({ type: 'table', name: table })];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.length > 0];
                }
            });
        });
    };
    // Columns
    // ===============================================================================================
    /**
     * Get all the available columns in the current schema/database. Can be filtered to a specific table
     */
    SQLite.prototype.columns = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var columns, tables, columnsPerTable;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!table) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.knex.raw("PRAGMA table_xinfo(??)", table)];
                    case 1:
                        columns = _a.sent();
                        return [2 /*return*/, columns.map(function (column) { return ({
                                table: table,
                                column: column.name,
                            }); })];
                    case 2: return [4 /*yield*/, this.tables()];
                    case 3:
                        tables = _a.sent();
                        return [4 /*yield*/, Promise.all(tables.map(function (table) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.columns(table)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); }))];
                    case 4:
                        columnsPerTable = _a.sent();
                        return [2 /*return*/, (0, lodash_flatten_1.default)(columnsPerTable)];
                }
            });
        });
    };
    SQLite.prototype.columnInfo = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var getColumnsForTable, tables, columnsPerTable, columns;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getColumnsForTable = function (table) { return __awaiter(_this, void 0, void 0, function () {
                            var tablesWithAutoIncrementPrimaryKeys, columns, foreignKeys, indexList, indexInfoList;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.knex
                                            .select('name')
                                            .from('sqlite_master')
                                            .whereRaw("sql LIKE \"%AUTOINCREMENT%\"")];
                                    case 1:
                                        tablesWithAutoIncrementPrimaryKeys = (_a.sent()).map(function (_a) {
                                            var name = _a.name;
                                            return name;
                                        });
                                        return [4 /*yield*/, this.knex.raw("PRAGMA table_xinfo(??)", table)];
                                    case 2:
                                        columns = _a.sent();
                                        return [4 /*yield*/, this.knex.raw("PRAGMA foreign_key_list(??)", table)];
                                    case 3:
                                        foreignKeys = _a.sent();
                                        return [4 /*yield*/, this.knex.raw("PRAGMA index_list(??)", table)];
                                    case 4:
                                        indexList = _a.sent();
                                        return [4 /*yield*/, Promise.all(indexList.map(function (index) {
                                                return _this.knex.raw("PRAGMA index_info(??)", index.name);
                                            }))];
                                    case 5:
                                        indexInfoList = _a.sent();
                                        return [2 /*return*/, columns.map(function (raw) {
                                                var foreignKey = foreignKeys.find(function (fk) { return fk.from === raw.name; });
                                                var indexIndex = indexInfoList.findIndex(function (list) {
                                                    return list.find(function (fk) { return fk.name === raw.name; });
                                                });
                                                var index = indexList[indexIndex];
                                                var indexInfo = indexInfoList[indexIndex];
                                                return {
                                                    name: raw.name,
                                                    table: table,
                                                    data_type: (0, extract_type_1.default)(raw.type),
                                                    default_value: parseDefaultValue(raw.dflt_value),
                                                    max_length: (0, extract_max_length_1.default)(raw.type),
                                                    /** @NOTE SQLite3 doesn't support precision/scale */
                                                    numeric_precision: null,
                                                    numeric_scale: null,
                                                    is_generated: raw.hidden !== 0,
                                                    generation_expression: null,
                                                    is_nullable: raw.notnull === 0,
                                                    is_unique: !!(index === null || index === void 0 ? void 0 : index.unique) && (indexInfo === null || indexInfo === void 0 ? void 0 : indexInfo.length) === 1,
                                                    is_primary_key: raw.pk === 1,
                                                    has_auto_increment: raw.pk === 1 && tablesWithAutoIncrementPrimaryKeys.includes(table),
                                                    foreign_key_column: (foreignKey === null || foreignKey === void 0 ? void 0 : foreignKey.to) || null,
                                                    foreign_key_table: (foreignKey === null || foreignKey === void 0 ? void 0 : foreignKey.table) || null,
                                                };
                                            })];
                                }
                            });
                        }); };
                        if (!!table) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.tables()];
                    case 1:
                        tables = _a.sent();
                        return [4 /*yield*/, Promise.all(tables.map(function (table) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, getColumnsForTable(table)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); }))];
                    case 2:
                        columnsPerTable = _a.sent();
                        return [2 /*return*/, (0, lodash_flatten_1.default)(columnsPerTable)];
                    case 3:
                        if (!(table && !column)) return [3 /*break*/, 5];
                        return [4 /*yield*/, getColumnsForTable(table)];
                    case 4: return [2 /*return*/, _a.sent()];
                    case 5: return [4 /*yield*/, getColumnsForTable(table)];
                    case 6:
                        columns = _a.sent();
                        return [2 /*return*/, columns.find(function (columnInfo) { return columnInfo.name === column; })];
                }
            });
        });
    };
    /**
     * Check if a table exists in the current schema/database
     */
    SQLite.prototype.hasColumn = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var isColumn, results, resultsVal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        isColumn = false;
                        return [4 /*yield*/, this.knex.raw("SELECT COUNT(*) AS ct FROM pragma_table_xinfo('".concat(table, "') WHERE name='").concat(column, "'"))];
                    case 1:
                        results = _a.sent();
                        resultsVal = results[0]['ct'];
                        if (resultsVal !== 0) {
                            isColumn = true;
                        }
                        return [2 /*return*/, isColumn];
                }
            });
        });
    };
    /**
     * Get the primary key column for the given table
     */
    SQLite.prototype.primary = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var columns, pkColumn;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex.raw("PRAGMA table_xinfo(??)", table)];
                    case 1:
                        columns = _a.sent();
                        pkColumn = columns.find(function (col) { return col.pk !== 0; });
                        return [2 /*return*/, (pkColumn === null || pkColumn === void 0 ? void 0 : pkColumn.name) || null];
                }
            });
        });
    };
    // Foreign Keys
    // ===============================================================================================
    SQLite.prototype.foreignKeys = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var keys, tables, keysPerTable;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!table) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.knex.raw("PRAGMA foreign_key_list(??)", table)];
                    case 1:
                        keys = _a.sent();
                        return [2 /*return*/, keys.map(function (key) { return ({
                                table: table,
                                column: key.from,
                                foreign_key_table: key.table,
                                foreign_key_column: key.to,
                                on_update: key.on_update,
                                on_delete: key.on_delete,
                                constraint_name: null,
                            }); })];
                    case 2: return [4 /*yield*/, this.tables()];
                    case 3:
                        tables = _a.sent();
                        return [4 /*yield*/, Promise.all(tables.map(function (table) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.foreignKeys(table)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            }); }); }))];
                    case 4:
                        keysPerTable = _a.sent();
                        return [2 /*return*/, (0, lodash_flatten_1.default)(keysPerTable)];
                }
            });
        });
    };
    return SQLite;
}());
exports.default = SQLite;
