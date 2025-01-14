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
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDefaultValue = exports.rawColumnToColumn = void 0;
var strip_quotes_1 = require("../utils/strip-quotes");
/**
 * NOTE: Use previous optimizer for better data dictionary performance.
 */
var OPTIMIZER_FEATURES = '11.2.0.4';
function rawColumnToColumn(rawColumn) {
    var is_generated = rawColumn.VIRTUAL_COLUMN === 'YES';
    var default_value = parseDefaultValue(rawColumn.DATA_DEFAULT);
    return {
        name: rawColumn.COLUMN_NAME,
        table: rawColumn.TABLE_NAME,
        data_type: rawColumn.DATA_TYPE,
        default_value: !is_generated ? default_value : null,
        generation_expression: is_generated ? default_value : null,
        max_length: rawColumn.DATA_LENGTH,
        numeric_precision: rawColumn.DATA_PRECISION,
        numeric_scale: rawColumn.DATA_SCALE,
        is_generated: rawColumn.VIRTUAL_COLUMN === 'YES',
        is_nullable: rawColumn.NULLABLE === 'Y',
        is_unique: rawColumn.CONSTRAINT_TYPE === 'U',
        is_primary_key: rawColumn.CONSTRAINT_TYPE === 'P',
        has_auto_increment: rawColumn.IDENTITY_COLUMN === 'YES',
        foreign_key_column: rawColumn.REFERENCED_COLUMN_NAME,
        foreign_key_table: rawColumn.REFERENCED_TABLE_NAME,
        comment: rawColumn.COLUMN_COMMENT,
    };
}
exports.rawColumnToColumn = rawColumnToColumn;
function parseDefaultValue(value) {
    if (value === null || value.trim().toLowerCase() === 'null')
        return null;
    if (value === 'CURRENT_TIMESTAMP ')
        return 'CURRENT_TIMESTAMP';
    return (0, strip_quotes_1.stripQuotes)(value);
}
exports.parseDefaultValue = parseDefaultValue;
var oracleDB = /** @class */ (function () {
    function oracleDB(knex) {
        this.knex = knex;
    }
    // Tables
    // ===============================================================================================
    /**
     * List all existing tables in the current schema/database
     */
    oracleDB.prototype.tables = function () {
        return __awaiter(this, void 0, void 0, function () {
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .select(this.knex.raw("\n          /*+ OPTIMIZER_FEATURES_ENABLE('".concat(OPTIMIZER_FEATURES, "') */\n            \"TABLE_NAME\" \"name\"\n        ")))
                            .from('USER_TABLES')];
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
    oracleDB.prototype.tableInfo = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .select(this.knex.raw("\n          /*+ OPTIMIZER_FEATURES_ENABLE('".concat(OPTIMIZER_FEATURES, "') */\n            \"TABLE_NAME\" \"name\"\n        ")))
                            .from('USER_TABLES');
                        if (!table) return [3 /*break*/, 2];
                        return [4 /*yield*/, query.andWhere({ TABLE_NAME: table }).first()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, query];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Check if a table exists in the current schema/database
     */
    oracleDB.prototype.hasTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .select(this.knex.raw("\n          /*+ OPTIMIZER_FEATURES_ENABLE('".concat(OPTIMIZER_FEATURES, "') */\n            COUNT(*) \"count\"\n        ")))
                            .from('USER_TABLES')
                            .where({ TABLE_NAME: table })
                            .first()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, !!(result === null || result === void 0 ? void 0 : result.count)];
                }
            });
        });
    };
    // Columns
    // ===============================================================================================
    /**
     * Get all the available columns in the current schema/database. Can be filtered to a specific table
     */
    oracleDB.prototype.columns = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .select(this.knex.raw("\n          /*+ OPTIMIZER_FEATURES_ENABLE('".concat(OPTIMIZER_FEATURES, "') NO_QUERY_TRANSFORMATION */\n            \"TABLE_NAME\" \"table\",\n            \"COLUMN_NAME\" \"column\"\n        ")))
                            .from('USER_TAB_COLS')
                            .where({ HIDDEN_COLUMN: 'NO' });
                        if (table) {
                            query.andWhere({ TABLE_NAME: table });
                        }
                        return [4 /*yield*/, query];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    oracleDB.prototype.columnInfo = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rawColumn, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .with('uc', this.knex.raw("\n          SELECT /*+ MATERIALIZE */\n            \"uc\".\"TABLE_NAME\",\n            \"ucc\".\"COLUMN_NAME\",\n            \"uc\".\"CONSTRAINT_NAME\",\n            \"uc\".\"CONSTRAINT_TYPE\",\n            \"uc\".\"R_CONSTRAINT_NAME\",\n            COUNT(*) OVER(\n              PARTITION BY\n                \"uc\".\"CONSTRAINT_NAME\"\n            ) \"CONSTRAINT_COUNT\", \n            ROW_NUMBER() OVER(\n              PARTITION BY\n                \"uc\".\"TABLE_NAME\", \n                \"ucc\".\"COLUMN_NAME\" \n              ORDER BY \n                \"uc\".\"CONSTRAINT_TYPE\"\n            ) \"CONSTRAINT_PRIORITY\"\n          FROM \"USER_CONSTRAINTS\" \"uc\"\n          INNER JOIN \"USER_CONS_COLUMNS\" \"ucc\"\n            ON \"uc\".\"CONSTRAINT_NAME\" = \"ucc\".\"CONSTRAINT_NAME\"\n          WHERE \"uc\".\"CONSTRAINT_TYPE\" IN ('P', 'U', 'R')\n      "))
                            .select(this.knex.raw("\n          /*+ OPTIMIZER_FEATURES_ENABLE('".concat(OPTIMIZER_FEATURES, "') */\n            \"c\".\"TABLE_NAME\", \n            \"c\".\"COLUMN_NAME\", \n            \"c\".\"DATA_DEFAULT\", \n            \"c\".\"DATA_TYPE\", \n            \"c\".\"DATA_LENGTH\", \n            \"c\".\"DATA_PRECISION\", \n            \"c\".\"DATA_SCALE\", \n            \"c\".\"NULLABLE\", \n            \"c\".\"IDENTITY_COLUMN\", \n            \"c\".\"VIRTUAL_COLUMN\", \n            \"cm\".\"COMMENTS\" \"COLUMN_COMMENT\", \n            \"ct\".\"CONSTRAINT_TYPE\",\n            \"fk\".\"TABLE_NAME\" \"REFERENCED_TABLE_NAME\",\n            \"fk\".\"COLUMN_NAME\" \"REFERENCED_COLUMN_NAME\"\n          FROM \"USER_TAB_COLS\" \"c\" \n          LEFT JOIN \"USER_COL_COMMENTS\" \"cm\"\n            ON \"c\".\"TABLE_NAME\" = \"cm\".\"TABLE_NAME\" \n            AND \"c\".\"COLUMN_NAME\" = \"cm\".\"COLUMN_NAME\" \n          LEFT JOIN \"uc\" \"ct\"\n            ON \"c\".\"TABLE_NAME\" = \"ct\".\"TABLE_NAME\" \n            AND \"c\".\"COLUMN_NAME\" = \"ct\".\"COLUMN_NAME\"\n            AND \"ct\".\"CONSTRAINT_COUNT\" = 1 \n            AND \"ct\".\"CONSTRAINT_PRIORITY\" = 1\n          LEFT JOIN \"uc\" \"fk\"\n            ON \"ct\".\"R_CONSTRAINT_NAME\" = \"fk\".\"CONSTRAINT_NAME\"\n        ")))
                            .where({ 'c.HIDDEN_COLUMN': 'NO' });
                        if (table) {
                            query.andWhere({ 'c.TABLE_NAME': table });
                        }
                        if (!column) return [3 /*break*/, 2];
                        return [4 /*yield*/, query
                                .andWhere({
                                'c.COLUMN_NAME': column,
                            })
                                .first()];
                    case 1:
                        rawColumn = _a.sent();
                        return [2 /*return*/, rawColumnToColumn(rawColumn)];
                    case 2: return [4 /*yield*/, query];
                    case 3:
                        records = _a.sent();
                        return [2 /*return*/, records.map(rawColumnToColumn)];
                }
            });
        });
    };
    /**
     * Check if a table exists in the current schema/database
     */
    oracleDB.prototype.hasColumn = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .select(this.knex.raw("\n          /*+ OPTIMIZER_FEATURES_ENABLE('".concat(OPTIMIZER_FEATURES, "') NO_QUERY_TRANSFORMATION */\n            COUNT(*) \"count\"\n        ")))
                            .from('USER_TAB_COLS')
                            .where({
                            TABLE_NAME: table,
                            COLUMN_NAME: column,
                            HIDDEN_COLUMN: 'NO',
                        })
                            .first()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, !!(result === null || result === void 0 ? void 0 : result.count)];
                }
            });
        });
    };
    /**
     * Get the primary key column for the given table
     */
    oracleDB.prototype.primary = function (table) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .with('uc', this.knex
                            .select(this.knex.raw("/*+ MATERIALIZE */ \"CONSTRAINT_NAME\""))
                            .from('USER_CONSTRAINTS')
                            .where({
                            TABLE_NAME: table,
                            CONSTRAINT_TYPE: 'P',
                        }))
                            .select(this.knex.raw("\n          /*+ OPTIMIZER_FEATURES_ENABLE('".concat(OPTIMIZER_FEATURES, "') */\n            \"ucc\".\"COLUMN_NAME\"\n          FROM \"USER_CONS_COLUMNS\" \"ucc\"\n          INNER JOIN \"uc\" \"pk\"\n            ON \"ucc\".\"CONSTRAINT_NAME\" = \"pk\".\"CONSTRAINT_NAME\"\n        ")))
                            .first()];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, (_a = result === null || result === void 0 ? void 0 : result.COLUMN_NAME) !== null && _a !== void 0 ? _a : null];
                }
            });
        });
    };
    // Foreign Keys
    // ===============================================================================================
    oracleDB.prototype.foreignKeys = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .with('ucc', this.knex.raw("\n          SELECT /*+ MATERIALIZE */\n            \"TABLE_NAME\",\n            \"COLUMN_NAME\",\n            \"CONSTRAINT_NAME\"\n          FROM \"USER_CONS_COLUMNS\"\n        "))
                            .select(this.knex.raw("\n          /*+ OPTIMIZER_FEATURES_ENABLE('".concat(OPTIMIZER_FEATURES, "') */\n            \"uc\".\"TABLE_NAME\" \"table\", \n            \"fcc\".\"COLUMN_NAME\" \"column\", \n            \"rcc\".\"TABLE_NAME\" AS \"foreign_key_table\",\n            \"rcc\".\"COLUMN_NAME\" AS \"foreign_key_column\",\n            \"uc\".\"CONSTRAINT_NAME\" \"constraint_name\", \n            NULL as \"on_update\", \n            \"uc\".\"DELETE_RULE\" \"on_delete\" \n          FROM \"USER_CONSTRAINTS\" \"uc\" \n          INNER JOIN \"ucc\" \"fcc\"\n            ON \"uc\".\"CONSTRAINT_NAME\" = \"fcc\".\"CONSTRAINT_NAME\"\n          INNER JOIN \"ucc\" \"rcc\"\n            ON \"uc\".\"R_CONSTRAINT_NAME\" = \"rcc\".\"CONSTRAINT_NAME\"\n      ")))
                            .where({ 'uc.CONSTRAINT_TYPE': 'R' });
                        if (table) {
                            query.andWhere({ 'uc.TABLE_NAME': table });
                        }
                        return [4 /*yield*/, query];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return oracleDB;
}());
exports.default = oracleDB;
