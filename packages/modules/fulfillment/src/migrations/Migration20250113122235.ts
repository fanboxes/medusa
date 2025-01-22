import { Migration } from "@mikro-orm/migrations"

export class Migration20250113122235 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`
      UPDATE shipping_option_rule
      SET value = 'true'::jsonb
      WHERE value = '"true"'::jsonb;
    `)
    this.addSql(`
      UPDATE shipping_option_rule
      SET value = 'false'::jsonb
      WHERE value = '"false"'::jsonb;
    `)
  }

  override async down(): Promise<void> {
    this.addSql(`
      UPDATE shipping_option_rule
      SET value = '"true"'::jsonb
      WHERE value = 'true'::jsonb;
    `)
    this.addSql(`
      UPDATE shipping_option_rule
      SET value = '"false"'::jsonb
      WHERE value = 'false'::jsonb;
    `)
  }
}
