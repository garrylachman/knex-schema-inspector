import { Knex } from 'knex';
import { SchemaInspector } from '../types/schema-inspector';
import { Table } from '../types/table';
import { Column } from '../types/column';
/**
 * Converts Postgres default value to JS
 * Eg `'example'::character varying` => `example`
 */
export declare function parseDefaultValue(value: string | null): string | null;
export default class Postgres implements SchemaInspector {
    knex: Knex;
    schema: string;
    explodedSchema: string[];
    constructor(knex: Knex);
    /**
     * Set the schema to be used in other methods
     */
    withSchema(schema: string): this;
    /**
     * List all existing tables in the current schema/database
     */
    tables(): Promise<any>;
    /**
     * Get the table info for a given table. If table parameter is undefined, it will return all tables
     * in the current schema/database
     */
    tableInfo(): Promise<Table[]>;
    tableInfo(table: string): Promise<Table>;
    /**
     * Check if a table exists in the current schema/database
     */
    hasTable(table: string): Promise<boolean>;
    /**
     * Get all the available columns in the current schema/database. Can be filtered to a specific table
     */
    columns(table?: string): Promise<any>;
    /**
     * Get the column info for all columns, columns in a given table, or a specific column.
     */
    columnInfo(): Promise<Column[]>;
    columnInfo(table: string): Promise<Column[]>;
    columnInfo(table: string, column: string): Promise<Column>;
    /**
     * Check if the given table contains the given column
     */
    hasColumn(table: string, column: string): Promise<any>;
    /**
     * Get the primary key column for the given table
     */
    primary(table: string): Promise<string | null>;
    foreignKeys(table?: string): Promise<any>;
}
