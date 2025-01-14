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
 * Converts CockroachDB default value to JS
 * Eg `'example'::character varying` => `example`
 */
function parseDefaultValue(value) {
    if (value === null)
        return null;
    if (value.startsWith('nextval('))
        return value;
    value = value.split('::')[0];
    return (0, strip_quotes_1.stripQuotes)(value);
}
exports.parseDefaultValue = parseDefaultValue;
var CockroachDB = /** @class */ (function () {
    function CockroachDB(knex) {
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
    // CockroachDB specific
    // ===============================================================================================
    /**
     * Set the schema to be used in other methods
     */
    CockroachDB.prototype.withSchema = function (schema) {
        this.schema = schema;
        this.explodedSchema = [this.schema];
        return this;
    };
    // Tables
    // ===============================================================================================
    /**
     * List all existing tables in the current schema/database
     */
    CockroachDB.prototype.tables = function () {
        return __awaiter(this, void 0, void 0, function () {
            var records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .select('tablename')
                            .from('pg_catalog.pg_tables')
                            .whereIn('schemaname', this.explodedSchema)];
                    case 1:
                        records = _a.sent();
                        return [2 /*return*/, records.map(function (_a) {
                                var tablename = _a.tablename;
                                return tablename;
                            })];
                }
            });
        });
    };
    CockroachDB.prototype.tableInfo = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rawTable, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .select('table_name', 'table_schema', this.knex
                            .select(this.knex.raw('obj_description(oid)'))
                            .from('pg_class')
                            .where({ relkind: 'r' })
                            .andWhere({ relname: 'table_name' })
                            .as('table_comment'))
                            .from('information_schema.tables')
                            .whereIn('table_schema', this.explodedSchema)
                            .andWhereRaw("\"table_catalog\" = current_database()")
                            .andWhere({ table_type: 'BASE TABLE' })
                            .orderBy('table_name', 'asc');
                        if (!table) return [3 /*break*/, 2];
                        return [4 /*yield*/, query
                                .andWhere({ table_name: table })
                                .limit(1)
                                .first()];
                    case 1:
                        rawTable = _a.sent();
                        return [2 /*return*/, {
                                name: rawTable.table_name,
                                schema: rawTable.table_schema,
                                comment: rawTable.table_comment,
                            }];
                    case 2: return [4 /*yield*/, query];
                    case 3:
                        records = _a.sent();
                        return [2 /*return*/, records.map(function (rawTable) {
                                return {
                                    name: rawTable.table_name,
                                    schema: rawTable.table_schema,
                                    comment: rawTable.table_comment,
                                };
                            })];
                }
            });
        });
    };
    /**
     * Check if a table exists in the current schema/database
     */
    CockroachDB.prototype.hasTable = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var subquery, record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        subquery = this.knex
                            .select()
                            .from('information_schema.tables')
                            .whereIn('table_schema', this.explodedSchema)
                            .andWhere({ table_name: table });
                        return [4 /*yield*/, this.knex
                                .select(this.knex.raw('exists (?)', [subquery]))
                                .first()];
                    case 1:
                        record = _a.sent();
                        return [2 /*return*/, (record === null || record === void 0 ? void 0 : record.exists) || false];
                }
            });
        });
    };
    // Columns
    // ===============================================================================================
    /**
     * Get all the available columns in the current schema/database. Can be filtered to a specific table
     */
    CockroachDB.prototype.columns = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var query, records;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = this.knex
                            .select('table_name', 'column_name')
                            .from('information_schema.columns')
                            .whereIn('table_schema', this.explodedSchema);
                        if (table) {
                            query.andWhere({ table_name: table });
                        }
                        return [4 /*yield*/, query];
                    case 1:
                        records = _a.sent();
                        return [2 /*return*/, records.map(function (_a) {
                                var table_name = _a.table_name, column_name = _a.column_name;
                                return ({
                                    table: table_name,
                                    column: column_name,
                                });
                            })];
                }
            });
        });
    };
    CockroachDB.prototype.columnInfo = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var knex, bindings, schemaIn, _a, columns, constraints, parsedColumms;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        knex = this.knex;
                        bindings = [];
                        if (table)
                            bindings.push(table);
                        if (column)
                            bindings.push(column);
                        schemaIn = this.explodedSchema.map(function (schemaName) { return "".concat(_this.knex.raw('?', [schemaName]), "::regnamespace"); });
                        return [4 /*yield*/, Promise.all([
                                knex.raw("\n         SELECT *, CASE WHEN res.is_generated THEN (\n          SELECT\n            generation_expression\n          FROM\n            information_schema.columns\n          WHERE\n            table_schema = res.schema \n            AND table_name = res.table \n            AND column_name = res.name\n          ) ELSE NULL END AS generation_expression\n         FROM (\n         SELECT\n           att.attname AS name,\n           rel.relname AS table,\n           rel.relnamespace::regnamespace::text AS schema,\n           format_type(att.atttypid, null) AS data_type,\n           NOT att.attnotnull AS is_nullable,\n           CASE WHEN att.attgenerated = '' THEN pg_get_expr(ad.adbin, ad.adrelid) ELSE null END AS default_value,\n           att.attgenerated = 's' AS is_generated,\n           CASE\n             WHEN att.atttypid IN (1042, 1043) THEN (att.atttypmod - 4)::int4\n             WHEN att.atttypid IN (1560, 1562) THEN (att.atttypmod)::int4\n             ELSE NULL\n           END AS max_length,\n           des.description AS comment,\n           CASE att.atttypid\n             WHEN 21 THEN 16\n             WHEN 23 THEN 32\n             WHEN 20 THEN 64\n             WHEN 1700 THEN\n               CASE WHEN atttypmod = -1 THEN NULL\n                 ELSE (((atttypmod - 4) >> 16) & 65535)::int4\n               END\n             WHEN 700 THEN 24\n             WHEN 701 THEN 53\n             ELSE NULL\n           END AS numeric_precision,\n           CASE\n             WHEN atttypid IN (21, 23, 20) THEN 0\n             WHEN atttypid = 1700 THEN\n               CASE\n                 WHEN atttypmod = -1 THEN NULL\n                 ELSE ((atttypmod - 4) & 65535)::int4\n               END\n             ELSE null\n           END AS numeric_scale\n         FROM\n           pg_attribute att\n           LEFT JOIN pg_class rel ON att.attrelid = rel.oid\n           LEFT JOIN pg_attrdef ad ON (att.attrelid, att.attnum) = (ad.adrelid, ad.adnum)\n           LEFT JOIN pg_description des ON (att.attrelid, att.attnum) = (des.objoid, des.objsubid)\n         WHERE\n           rel.relnamespace IN (".concat(schemaIn, ")\n           ").concat(table ? 'AND rel.relname = ?' : '', "\n           ").concat(column ? 'AND att.attname = ?' : '', "\n           AND rel.relkind = 'r'\n           AND att.attnum > 0\n           AND NOT att.attisdropped\n         ORDER BY rel.relname, att.attnum) res;\n       "), bindings),
                                knex.raw("\n         SELECT\n           con.contype AS type,\n           rel.relname AS table,\n           att.attname AS column,\n           frel.relnamespace::regnamespace::text AS foreign_key_schema,\n           frel.relname AS foreign_key_table,\n           fatt.attname AS foreign_key_column\n         FROM\n           pg_constraint con\n         LEFT JOIN pg_class rel ON con.conrelid = rel.oid\n         LEFT JOIN pg_class frel ON con.confrelid = frel.oid\n         LEFT JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = con.conkey[1]\n         LEFT JOIN pg_attribute fatt ON fatt.attrelid = con.confrelid AND fatt.attnum = con.confkey[1]\n         WHERE con.connamespace IN (".concat(schemaIn, ")\n           AND array_length(con.conkey, 1) <= 1\n           AND (con.confkey IS NULL OR array_length(con.confkey, 1) = 1)\n           ").concat(table ? 'AND rel.relname = ?' : '', "\n           ").concat(column ? 'AND att.attname = ?' : '', "\n         "), bindings),
                            ])];
                    case 1:
                        _a = _b.sent(), columns = _a[0], constraints = _a[1];
                        parsedColumms = columns.rows.map(function (col) {
                            var _a, _b, _c, _d, _e;
                            var constraintsForColumn = constraints.rows.filter(function (constraint) {
                                return constraint.table === col.table && constraint.column === col.name;
                            });
                            var foreignKeyConstraint = constraintsForColumn.find(function (constraint) { return constraint.type === 'f'; });
                            return __assign(__assign({}, col), { is_unique: constraintsForColumn.some(function (constraint) {
                                    return ['u', 'p'].includes(constraint.type);
                                }), is_primary_key: constraintsForColumn.some(function (constraint) { return constraint.type === 'p'; }), has_auto_increment: ['integer', 'bigint'].includes(col.data_type) &&
                                    ((_b = (_a = col.default_value) === null || _a === void 0 ? void 0 : _a.startsWith('nextval(')) !== null && _b !== void 0 ? _b : false), default_value: parseDefaultValue(col.default_value), foreign_key_schema: (_c = foreignKeyConstraint === null || foreignKeyConstraint === void 0 ? void 0 : foreignKeyConstraint.foreign_key_schema) !== null && _c !== void 0 ? _c : null, foreign_key_table: (_d = foreignKeyConstraint === null || foreignKeyConstraint === void 0 ? void 0 : foreignKeyConstraint.foreign_key_table) !== null && _d !== void 0 ? _d : null, foreign_key_column: (_e = foreignKeyConstraint === null || foreignKeyConstraint === void 0 ? void 0 : foreignKeyConstraint.foreign_key_column) !== null && _e !== void 0 ? _e : null });
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
    CockroachDB.prototype.hasColumn = function (table, column) {
        return __awaiter(this, void 0, void 0, function () {
            var subquery, record;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        subquery = this.knex
                            .select()
                            .from('information_schema.columns')
                            .whereIn('table_schema', this.explodedSchema)
                            .andWhere({
                            table_name: table,
                            column_name: column,
                        });
                        return [4 /*yield*/, this.knex
                                .select(this.knex.raw('exists (?)', [subquery]))
                                .first()];
                    case 1:
                        record = _a.sent();
                        return [2 /*return*/, (record === null || record === void 0 ? void 0 : record.exists) || false];
                }
            });
        });
    };
    /**
     * Get the primary key column for the given table
     */
    CockroachDB.prototype.primary = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex
                            .select('information_schema.key_column_usage.column_name')
                            .from('information_schema.key_column_usage')
                            .leftJoin('information_schema.table_constraints', 'information_schema.table_constraints.constraint_name', 'information_schema.key_column_usage.constraint_name')
                            .whereIn('information_schema.table_constraints.table_schema', this.explodedSchema)
                            .andWhere({
                            'information_schema.table_constraints.constraint_type': 'PRIMARY KEY',
                            'information_schema.table_constraints.table_name': table,
                        })
                            .first()];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result ? result.column_name : null];
                }
            });
        });
    };
    // Foreign Keys
    // ===============================================================================================
    CockroachDB.prototype.foreignKeys = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            function stripRowQuotes(row) {
                return Object.fromEntries(Object.entries(row).map(function (_a) {
                    var key = _a[0], value = _a[1];
                    return [key, (0, strip_quotes_1.stripQuotes)(value)];
                }));
            }
            var result, rowsWithoutQuotes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.knex.raw("\n      SELECT\n        c.conrelid::regclass::text AS \"table\",\n        (\n          SELECT\n            STRING_AGG(a.attname, ','\n            ORDER BY\n              t.seq)\n          FROM (\n            SELECT\n              ROW_NUMBER() OVER (ROWS UNBOUNDED PRECEDING) AS seq,\n              attnum\n            FROM\n              UNNEST(c.conkey) AS t (attnum)) AS t\n          INNER JOIN pg_attribute AS a ON a.attrelid = c.conrelid\n            AND a.attnum = t.attnum) AS \"column\",\n        tt.name AS foreign_key_table,\n        (\n          SELECT\n            STRING_AGG(QUOTE_IDENT(a.attname), ','\n            ORDER BY\n              t.seq)\n          FROM (\n            SELECT\n              ROW_NUMBER() OVER (ROWS UNBOUNDED PRECEDING) AS seq,\n              attnum\n            FROM\n              UNNEST(c.confkey) AS t (attnum)) AS t\n        INNER JOIN pg_attribute AS a ON a.attrelid = c.confrelid\n          AND a.attnum = t.attnum) AS foreign_key_column,\n        tt.schema AS foreign_key_schema,\n        c.conname AS constraint_name,\n        CASE confupdtype\n        WHEN 'r' THEN\n          'RESTRICT'\n        WHEN 'c' THEN\n          'CASCADE'\n        WHEN 'n' THEN\n          'SET NULL'\n        WHEN 'd' THEN\n          'SET DEFAULT'\n        WHEN 'a' THEN\n          'NO ACTION'\n        ELSE\n          NULL\n        END AS on_update,\n        CASE confdeltype\n        WHEN 'r' THEN\n          'RESTRICT'\n        WHEN 'c' THEN\n          'CASCADE'\n        WHEN 'n' THEN\n          'SET NULL'\n        WHEN 'd' THEN\n          'SET DEFAULT'\n        WHEN 'a' THEN\n          'NO ACTION'\n        ELSE\n          NULL\n        END AS\n        on_delete\n      FROM\n        pg_catalog.pg_constraint AS c\n        INNER JOIN (\n          SELECT\n            pg_class.oid,\n            QUOTE_IDENT(pg_namespace.nspname) AS SCHEMA,\n            QUOTE_IDENT(pg_class.relname) AS name\n          FROM\n            pg_class\n            INNER JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid) AS tf ON tf.oid = c.conrelid\n        INNER JOIN (\n          SELECT\n            pg_class.oid,\n            QUOTE_IDENT(pg_namespace.nspname) AS SCHEMA,\n            QUOTE_IDENT(pg_class.relname) AS name\n          FROM\n            pg_class\n            INNER JOIN pg_namespace ON pg_class.relnamespace = pg_namespace.oid) AS tt ON tt.oid = c.confrelid\n      WHERE\n        c.contype = 'f';\n    ")];
                    case 1:
                        result = _a.sent();
                        rowsWithoutQuotes = result.rows.map(stripRowQuotes);
                        if (table) {
                            return [2 /*return*/, rowsWithoutQuotes.filter(function (row) { return row.table === table; })];
                        }
                        return [2 /*return*/, rowsWithoutQuotes];
                }
            });
        });
    };
    return CockroachDB;
}());
exports.default = CockroachDB;
