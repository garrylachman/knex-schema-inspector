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
exports.parseDefaultValue = void 0;
var strip_quotes_1 = require("../utils/strip-quotes");
/**
 * Converts Postgres default value to JS
 * Eg `'example'::character varying` => `example`
 */
function parseDefaultValue(value) {
    if (value === null)
        return null;
    if (value.startsWith('nextval('))
        return value;
    value = value.split('::')[0];
    if (value.trim().toLowerCase() === 'null')
        return null;
    return (0, strip_quotes_1.stripQuotes)(value);
}
exports.parseDefaultValue = parseDefaultValue;
var Postgres = /** @class */ (function () {
    function Postgres(knex) {
        this.knex = knex;
        var config = knex.client.config;
        if (!config.searchPath) {
            this.schema = 'public';
            this.explodedSchema = [this.schema];
        }
        else if (typeof config.searchPath === 'string') {
            this.schema = config.searchPath;
            this.explodedSchema = [config.searchPath];
        }
        else {
            this.schema = config.searchPath[0];
            this.explodedSchema = config.searchPath;
        }
    }
    // Postgres specific
    // ===============================================================================================
    /**
     * Set the schema to be used in other methods
     */
    Postgres.prototype.withSchema = function (schema) {
        this.schema = schema;
        this.explodedSchema = [this.schema];
        return this;
    };
    // Tables
    // ===============================================================================================
    /**
     * List all existing tables in the current schema/database
     */
    Postgres.prototype.tables = function () {
        return __awaiter(this, void 0, void 0, function () {
            var schemaIn, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schemaIn = this.explodedSchema.map(function (schemaName) { return "".concat(_this.knex.raw('?', [schemaName]), "::regnamespace"); });
                        return [4 /*yield*/, this.knex.raw("\n      SELECT\n        rel.relname AS name\n      FROM\n        pg_class rel\n      WHERE\n        rel.relnamespace IN (".concat(schemaIn, ")\n        AND rel.relkind = 'r'\n      ORDER BY rel.relname\n    "))];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows.map(function (row) { return row.name; })];
                }
            });
        });
    };
    Postgres.prototype.tableInfo = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaIn, bindings, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schemaIn = this.explodedSchema.map(function (schemaName) { return "".concat(_this.knex.raw('?', [schemaName]), "::regnamespace"); });
                        bindings = [];
                        if (table)
                            bindings.push(table);
                        return [4 /*yield*/, this.knex.raw("\n      SELECT\n        rel.relnamespace::regnamespace::text AS schema,\n        rel.relname AS name,\n        des.description AS comment\n      FROM\n        pg_class rel\n      LEFT JOIN pg_description des ON rel.oid = des.objoid AND des.objsubid = 0\n      WHERE\n        rel.relnamespace IN (".concat(schemaIn, ")\n        ").concat(table ? 'AND rel.relname = ?' : '', "\n        AND rel.relkind = 'r'\n      ORDER BY rel.relname\n    "), bindings)];
                    case 1:
                        result = _a.sent();
                        if (table)
                            return [2 /*return*/, result.rows[0]];
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    /**
     * Check if a table exists in the current schema/database
     */
    Postgres.prototype.hasTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaIn, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schemaIn = this.explodedSchema.map(function (schemaName) { return "".concat(_this.knex.raw('?', [schemaName]), "::regnamespace"); });
                        return [4 /*yield*/, this.knex.raw("\n      SELECT\n        rel.relname AS name\n      FROM\n        pg_class rel\n      WHERE\n        rel.relnamespace IN (".concat(schemaIn, ")\n        AND rel.relkind = 'r'\n        AND rel.relname = ?\n      ORDER BY rel.relname\n    "), [table])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows.length > 0];
                }
            });
        });
    };
    // Columns
    // ===============================================================================================
    /**
     * Get all the available columns in the current schema/database. Can be filtered to a specific table
     */
    Postgres.prototype.columns = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var bindings, schemaIn, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        bindings = [];
                        if (table)
                            bindings.push(table);
                        schemaIn = this.explodedSchema.map(function (schemaName) { return "".concat(_this.knex.raw('?', [schemaName]), "::regnamespace"); });
                        return [4 /*yield*/, this.knex.raw("\n      SELECT\n        att.attname AS column,\n        rel.relname AS table\n      FROM\n        pg_attribute att\n        LEFT JOIN pg_class rel ON att.attrelid = rel.oid\n      WHERE\n        rel.relnamespace IN (".concat(schemaIn, ")\n        ").concat(table ? 'AND rel.relname = ?' : '', "\n        AND rel.relkind = 'r'\n        AND att.attnum > 0\n        AND NOT att.attisdropped;\n    "), bindings)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    Postgres.prototype.columnInfo = function (table, column) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var knex, bindings, schemaIn, versionResponse, majorVersion, generationSelect, _f, columns, constraints, parsedColumms;
            var _this = this;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        knex = this.knex;
                        bindings = [];
                        if (table)
                            bindings.push(table);
                        if (column)
                            bindings.push(column);
                        schemaIn = this.explodedSchema.map(function (schemaName) { return "".concat(_this.knex.raw('?', [schemaName]), "::regnamespace"); });
                        return [4 /*yield*/, this.knex.raw("SHOW server_version")];
                    case 1:
                        versionResponse = _g.sent();
                        majorVersion = (_e = (_d = (_c = (_b = (_a = versionResponse.rows) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.server_version) === null || _c === void 0 ? void 0 : _c.split('.')) === null || _d === void 0 ? void 0 : _d[0]) !== null && _e !== void 0 ? _e : 10;
                        generationSelect = "\n      NULL AS generation_expression,\n      pg_get_expr(ad.adbin, ad.adrelid) AS default_value,\n      FALSE AS is_generated,\n    ";
                        if (Number(majorVersion) >= 12) {
                            generationSelect = "\n        CASE WHEN att.attgenerated = 's' THEN pg_get_expr(ad.adbin, ad.adrelid) ELSE null END AS generation_expression,\n        CASE WHEN att.attgenerated = '' THEN pg_get_expr(ad.adbin, ad.adrelid) ELSE null END AS default_value,\n        att.attgenerated = 's' AS is_generated,\n      ";
                        }
                        return [4 /*yield*/, Promise.all([
                                knex.raw("\n        SELECT\n        \tatt.attname AS name,\n          rel.relname AS table,\n          rel.relnamespace::regnamespace::text as schema,\n          att.atttypid::regtype::text AS data_type,\n          NOT att.attnotnull AS is_nullable,\n          ".concat(generationSelect, "\n          CASE\n            WHEN att.atttypid IN (1042, 1043) THEN (att.atttypmod - 4)::int4\n            WHEN att.atttypid IN (1560, 1562) THEN (att.atttypmod)::int4\n            ELSE NULL\n          END AS max_length,\n          des.description AS comment,\n          CASE att.atttypid\n            WHEN 21 THEN 16\n            WHEN 23 THEN 32\n            WHEN 20 THEN 64\n            WHEN 1700 THEN\n              CASE WHEN atttypmod = -1 THEN NULL\n                ELSE (((atttypmod - 4) >> 16) & 65535)::int4\n              END\n            WHEN 700 THEN 24\n            WHEN 701 THEN 53\n            ELSE NULL\n          END AS numeric_precision,\n          CASE\n            WHEN atttypid IN (21, 23, 20) THEN 0\n            WHEN atttypid = 1700 THEN\n              CASE\n                WHEN atttypmod = -1 THEN NULL\n                ELSE ((atttypmod - 4) & 65535)::int4\n              END\n            ELSE null\n          END AS numeric_scale\n        FROM\n          pg_attribute att\n          LEFT JOIN pg_class rel ON att.attrelid = rel.oid\n          LEFT JOIN pg_attrdef ad ON (att.attrelid, att.attnum) = (ad.adrelid, ad.adnum)\n          LEFT JOIN pg_description des ON (att.attrelid, att.attnum) = (des.objoid, des.objsubid)\n        WHERE\n          rel.relnamespace IN (").concat(schemaIn, ")\n          ").concat(table ? 'AND rel.relname = ?' : '', "\n          ").concat(column ? 'AND att.attname = ?' : '', "\n          AND rel.relkind = 'r'\n          AND att.attnum > 0\n          AND NOT att.attisdropped\n        ORDER BY rel.relname, att.attnum;\n      "), bindings),
                                knex.raw("\n        SELECT\n          con.contype AS type,\n          rel.relname AS table,\n          att.attname AS column,\n          frel.relnamespace::regnamespace::text AS foreign_key_schema,\n          frel.relname AS foreign_key_table,\n          fatt.attname AS foreign_key_column,\n          CASE\n            WHEN con.contype = 'p' THEN pg_get_serial_sequence(att.attrelid::regclass::text, att.attname) != ''\n            ELSE NULL\n          END AS has_auto_increment\n        FROM\n          pg_constraint con\n        LEFT JOIN pg_class rel ON con.conrelid = rel.oid\n        LEFT JOIN pg_class frel ON con.confrelid = frel.oid\n        LEFT JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = con.conkey[1]\n        LEFT JOIN pg_attribute fatt ON fatt.attrelid = con.confrelid AND fatt.attnum = con.confkey[1]\n        WHERE con.connamespace IN (".concat(schemaIn, ")\n          AND array_length(con.conkey, 1) <= 1\n          AND (con.confkey IS NULL OR array_length(con.confkey, 1) = 1)\n          ").concat(table ? 'AND rel.relname = ?' : '', "\n          ").concat(column ? 'AND att.attname = ?' : '', "\n        "), bindings),
                            ])];
                    case 2:
                        _f = _g.sent(), columns = _f[0], constraints = _f[1];
                        parsedColumms = columns.rows.map(function (col) {
                            var _a, _b, _c;
                            var constraintsForColumn = constraints.rows.filter(function (constraint) {
                                return constraint.table === col.table && constraint.column === col.name;
                            });
                            var foreignKeyConstraint = constraintsForColumn.find(function (constraint) { return constraint.type === 'f'; });
                            return __assign(__assign({}, col), { is_unique: constraintsForColumn.some(function (constraint) {
                                    return ['u', 'p'].includes(constraint.type);
                                }), is_primary_key: constraintsForColumn.some(function (constraint) { return constraint.type === 'p'; }), has_auto_increment: constraintsForColumn.some(function (constraint) { return constraint.has_auto_increment; }), default_value: parseDefaultValue(col.default_value), foreign_key_schema: (_a = foreignKeyConstraint === null || foreignKeyConstraint === void 0 ? void 0 : foreignKeyConstraint.foreign_key_schema) !== null && _a !== void 0 ? _a : null, foreign_key_table: (_b = foreignKeyConstraint === null || foreignKeyConstraint === void 0 ? void 0 : foreignKeyConstraint.foreign_key_table) !== null && _b !== void 0 ? _b : null, foreign_key_column: (_c = foreignKeyConstraint === null || foreignKeyConstraint === void 0 ? void 0 : foreignKeyConstraint.foreign_key_column) !== null && _c !== void 0 ? _c : null });
                        });
                        if (table && column)
                            return [2 /*return*/, parsedColumms[0]];
                        return [2 /*return*/, parsedColumms];
                }
            });
        });
    };
    /**
     * Check if the given table contains the given column
     */
    Postgres.prototype.hasColumn = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaIn, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schemaIn = this.explodedSchema.map(function (schemaName) { return "".concat(_this.knex.raw('?', [schemaName]), "::regnamespace"); });
                        return [4 /*yield*/, this.knex.raw("\n      SELECT\n        att.attname AS column,\n        rel.relname AS table\n      FROM\n        pg_attribute att\n        LEFT JOIN pg_class rel ON att.attrelid = rel.oid\n      WHERE\n        rel.relnamespace IN (".concat(schemaIn, ")\n        AND rel.relname = ?\n        AND att.attname = ?\n        AND rel.relkind = 'r'\n        AND att.attnum > 0\n        AND NOT att.attisdropped;\n    "), [table, column])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    /**
     * Get the primary key column for the given table
     */
    Postgres.prototype.primary = function (table) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var schemaIn, result;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        schemaIn = this.explodedSchema.map(function (schemaName) { return "".concat(_this.knex.raw('?', [schemaName]), "::regnamespace"); });
                        return [4 /*yield*/, this.knex.raw("\n      SELECT\n          att.attname AS column\n        FROM\n          pg_constraint con\n        LEFT JOIN pg_class rel ON con.conrelid = rel.oid\n        LEFT JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = con.conkey[1]\n        WHERE con.connamespace IN (".concat(schemaIn, ")\n          AND con.contype = 'p'\n          AND array_length(con.conkey, 1) <= 1\n          AND rel.relname = ?\n    "), [table])];
                    case 1:
                        result = _d.sent();
                        return [2 /*return*/, (_c = (_b = (_a = result.rows) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.column) !== null && _c !== void 0 ? _c : null];
                }
            });
        });
    };
    // Foreign Keys
    // ===============================================================================================
    Postgres.prototype.foreignKeys = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var schemaIn, bindings, result;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schemaIn = this.explodedSchema.map(function (schemaName) { return "".concat(_this.knex.raw('?', [schemaName]), "::regnamespace"); });
                        bindings = [];
                        if (table)
                            bindings.push(table);
                        return [4 /*yield*/, this.knex.raw("\n       SELECT\n          con.conname AS constraint_name,\n          rel.relname AS table,\n          att.attname AS column,\n          frel.relnamespace::regnamespace::text AS foreign_key_schema,\n          frel.relname AS foreign_key_table,\n          fatt.attname AS foreign_key_column,\n          CASE con.confupdtype\n            WHEN 'r' THEN\n              'RESTRICT'\n            WHEN 'c' THEN\n              'CASCADE'\n            WHEN 'n' THEN\n              'SET NULL'\n            WHEN 'd' THEN\n              'SET DEFAULT'\n            WHEN 'a' THEN\n              'NO ACTION'\n            ELSE\n              NULL\n          END AS on_update,\n          CASE con.confdeltype\n            WHEN 'r' THEN\n              'RESTRICT'\n            WHEN 'c' THEN\n              'CASCADE'\n            WHEN 'n' THEN\n              'SET NULL'\n            WHEN 'd' THEN\n              'SET DEFAULT'\n            WHEN 'a' THEN\n              'NO ACTION'\n            ELSE\n              NULL\n          END AS on_delete\n        FROM\n          pg_constraint con\n        LEFT JOIN pg_class rel ON con.conrelid = rel.oid\n        LEFT JOIN pg_class frel ON con.confrelid = frel.oid\n        LEFT JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = con.conkey[1]\n        LEFT JOIN pg_attribute fatt ON fatt.attrelid = con.confrelid AND fatt.attnum = con.confkey[1]\n        WHERE con.connamespace IN (".concat(schemaIn, ")\n          AND array_length(con.conkey, 1) <= 1\n          AND (con.confkey IS NULL OR array_length(con.confkey, 1) = 1)\n          AND con.contype = 'f'\n          ").concat(table ? 'AND rel.relname = ?' : '', "\n    "), bindings)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.rows];
                }
            });
        });
    };
    return Postgres;
}());
exports.default = Postgres;
