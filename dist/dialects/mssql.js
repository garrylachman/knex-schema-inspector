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
    return __assign(__assign({}, rawColumn), { default_value: parseDefaultValue(rawColumn.default_value), generation_expression: rawColumn.generation_expression || null, is_generated: !!rawColumn.is_generated, is_unique: rawColumn.is_unique === true, is_primary_key: rawColumn.is_primary_key === true, is_nullable: rawColumn.is_nullable === 'YES', has_auto_increment: rawColumn.has_auto_increment === 'YES', numeric_precision: rawColumn.numeric_precision || null, numeric_scale: rawColumn.numeric_scale || null, max_length: parseMaxLength(rawColumn) });
    function parseMaxLength(rawColumn) {
        var max_length = Number(rawColumn.max_length);
        if (Number.isNaN(max_length) ||
            rawColumn.max_length === null ||
            rawColumn.max_length === undefined) {
            return null;
        }
        // n-* columns save every character as 2 bytes, which causes the max_length column to return the
        // max length in bytes instead of characters. For example:
        // varchar(100) => max_length == 100
        // nvarchar(100) => max_length == 200
        // In order to get the actual max_length value, we'll divide the value by 2
        // Unless the value is -1, which is the case for n(var)char(MAX)
        if (['nvarchar', 'nchar', 'ntext'].includes(rawColumn.data_type)) {
            return max_length === -1 ? max_length : max_length / 2;
        }
        return max_length;
    }
}
exports.rawColumnToColumn = rawColumnToColumn;
function parseDefaultValue(value) {
    if (value === null)
        return null;
    while (value.startsWith('(') && value.endsWith(')')) {
        value = value.slice(1, -1);
    }
    if (value.trim().toLowerCase() === 'null')
        return null;
    return (0, strip_quotes_1.stripQuotes)(value);
}
exports.parseDefaultValue = parseDefaultValue;
var MSSQL = /** @class */ (function () {
    function MSSQL(knex) {
        this.knex = knex;
    }
    // MS SQL specific
    // ===============================================================================================
    /**
     * Set the schema to be used in other methods
     */
    MSSQL.prototype.withSchema = function (schema) {
        this.schema = schema;
        return this;
    };
    Object.defineProperty(MSSQL.prototype, "schema", {
        get: function () {
            return this._schema || 'dbo';
        },
        set: function (value) {
            this._schema = value;
        },
        enumerable: false,
        configurable: true
    });
    // Tables
    // ===============================================================================================
    /**
     * List all existing tables in the current schema/database
     */
    MSSQL.prototype.tables = function () {
        return __awaiter(this, void 0, void 0, function () {
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .select('TABLE_NAME')
                            .from('INFORMATION_SCHEMA.TABLES')
                            .where({
                            TABLE_TYPE: 'BASE TABLE',
                            TABLE_CATALOG: this.knex.client.database(),
                            TABLE_SCHEMA: this.schema,
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
    MSSQL.prototype.tableInfo = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rawTable, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .select('TABLE_NAME', 'TABLE_SCHEMA', 'TABLE_CATALOG', 'TABLE_TYPE')
                            .from('INFORMATION_SCHEMA.TABLES')
                            .where({
                            TABLE_CATALOG: this.knex.client.database(),
                            TABLE_TYPE: 'BASE TABLE',
                            TABLE_SCHEMA: this.schema,
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
                                catalog: rawTable.TABLE_CATALOG,
                            }];
                    case 2: return [4 /*yield*/, query];
                    case 3:
                        records = _a.sent();
                        return [2 /*return*/, records.map(function (rawTable) {
                                return {
                                    name: rawTable.TABLE_NAME,
                                    schema: rawTable.TABLE_SCHEMA,
                                    catalog: rawTable.TABLE_CATALOG,
                                };
                            })];
                }
            });
        });
    };
    /**
     * Check if a table exists in the current schema/database
     */
    MSSQL.prototype.hasTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .count({ count: '*' })
                            .from('INFORMATION_SCHEMA.TABLES')
                            .where({
                            TABLE_CATALOG: this.knex.client.database(),
                            table_name: table,
                            TABLE_SCHEMA: this.schema,
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
    MSSQL.prototype.columns = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var query, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .select('TABLE_NAME', 'COLUMN_NAME')
                            .from('INFORMATION_SCHEMA.COLUMNS')
                            .where({
                            TABLE_CATALOG: this.knex.client.database(),
                            TABLE_SCHEMA: this.schema,
                        });
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
    MSSQL.prototype.columnInfo = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var dbName, query, rawColumn, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dbName = this.knex.client.database();
                        query = this.knex
                            .select(this.knex.raw("\n        [o].[name] AS [table],\n        [c].[name] AS [name],\n        [t].[name] AS [data_type],\n        [c].[max_length] AS [max_length],\n        [c].[precision] AS [numeric_precision],\n        [c].[scale] AS [numeric_scale],\n        CASE WHEN [c].[is_nullable] = 0 THEN\n          'NO'\n        ELSE\n          'YES'\n        END AS [is_nullable],\n        object_definition ([c].[default_object_id]) AS [default_value],\n        [i].[is_primary_key],\n        [i].[is_unique],\n        CASE [c].[is_identity]\n        WHEN 1 THEN\n          'YES'\n        ELSE\n          'NO'\n        END AS [has_auto_increment],\n        OBJECT_NAME ([fk].[referenced_object_id]) AS [foreign_key_table],\n        COL_NAME ([fk].[referenced_object_id],\n          [fk].[referenced_column_id]) AS [foreign_key_column],\n        [cc].[is_computed] as [is_generated],\n        [cc].[definition] as [generation_expression]"))
                            .from(this.knex.raw("??.[sys].[columns] [c]", [dbName]))
                            .joinRaw("JOIN [sys].[types] [t] ON [c].[user_type_id] = [t].[user_type_id]")
                            .joinRaw("JOIN [sys].[tables] [o] ON [o].[object_id] = [c].[object_id]")
                            .joinRaw("JOIN [sys].[schemas] [s] ON [s].[schema_id] = [o].[schema_id]")
                            .joinRaw("LEFT JOIN [sys].[computed_columns] AS [cc] ON [cc].[object_id] = [c].[object_id] AND [cc].[column_id] = [c].[column_id]")
                            .joinRaw("LEFT JOIN [sys].[foreign_key_columns] AS [fk] ON [fk].[parent_object_id] = [c].[object_id] AND [fk].[parent_column_id] = [c].[column_id]")
                            .joinRaw("LEFT JOIN (\n          SELECT\n            [ic].[object_id],\n            [ic].[column_id],\n            [ix].[is_unique],\n            [ix].[is_primary_key],\n            MAX([ic].[index_column_id]) OVER(partition by [ic].[index_id], [ic].[object_id]) AS index_column_count,\n            ROW_NUMBER() OVER (\n              PARTITION BY [ic].[object_id], [ic].[column_id]\n              ORDER BY [ix].[is_primary_key] DESC, [ix].[is_unique] DESC\n            ) AS index_priority\n          FROM\n            [sys].[index_columns] [ic]\n          JOIN [sys].[indexes] AS [ix] ON [ix].[object_id] = [ic].[object_id]\n            AND [ix].[index_id] = [ic].[index_id]\n        ) AS [i]\n        ON [i].[object_id] = [c].[object_id]\n        AND [i].[column_id] = [c].[column_id]\n        AND ISNULL([i].[index_column_count], 1) = 1\n        AND ISNULL([i].[index_priority], 1) = 1")
                            .where({ 's.name': this.schema });
                        if (table) {
                            query.andWhere({ 'o.name': table });
                        }
                        if (!column) return [3 /*break*/, 2];
                        return [4 /*yield*/, query
                                .andWhere({ 'c.name': column })
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
    MSSQL.prototype.hasColumn = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .count({ count: '*' })
                            .from('INFORMATION_SCHEMA.COLUMNS')
                            .where({
                            TABLE_CATALOG: this.knex.client.database(),
                            TABLE_NAME: table,
                            COLUMN_NAME: column,
                            TABLE_SCHEMA: this.schema,
                        })
                            .first()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result && result.count === 1) || false];
                }
            });
        });
    };
    /**
     * Get the primary key column for the given table
     */
    MSSQL.prototype.primary = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var results, columnName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex.raw("SELECT\n         Col.Column_Name\n       FROM\n         INFORMATION_SCHEMA.TABLE_CONSTRAINTS Tab,\n         INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE Col\n       WHERE\n         Col.Constraint_Name = Tab.Constraint_Name\n         AND Col.Table_Name = Tab.Table_Name\n         AND Constraint_Type = 'PRIMARY KEY'\n         AND Col.Table_Name = ?\n         AND Tab.CONSTRAINT_SCHEMA = ?", [table, this.schema])];
                    case 1:
                        results = _a.sent();
                        columnName = results.length > 0 ? results[0]['Column_Name'] : null;
                        return [2 /*return*/, columnName];
                }
            });
        });
    };
    // Foreign Keys
    // ===============================================================================================
    MSSQL.prototype.foreignKeys = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex.raw("\n      SELECT\n        OBJECT_NAME (fc.parent_object_id) AS \"table\",\n          COL_NAME (fc.parent_object_id, fc.parent_column_id) AS \"column\",\n          OBJECT_SCHEMA_NAME (f.referenced_object_id) AS foreign_key_schema,\n          OBJECT_NAME (f.referenced_object_id) AS foreign_key_table,\n          COL_NAME (fc.referenced_object_id, fc.referenced_column_id) AS foreign_key_column,\n          f.name AS constraint_name,\n          REPLACE(f.update_referential_action_desc, '_', ' ') AS on_update,\n          REPLACE(f.delete_referential_action_desc, '_', ' ') AS on_delete\n      FROM\n        sys.foreign_keys AS f\n        INNER JOIN sys.foreign_key_columns AS fc ON f.OBJECT_ID = fc.constraint_object_id\n      WHERE\n        OBJECT_SCHEMA_NAME (f.parent_object_id) = ?;\n    ", [this.schema])];
                    case 1:
                        result = _a.sent();
                        if (table) {
                            return [2 /*return*/, result === null || result === void 0 ? void 0 : result.filter(function (row) { return row.table === table; })];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return MSSQL;
}());
exports.default = MSSQL;
