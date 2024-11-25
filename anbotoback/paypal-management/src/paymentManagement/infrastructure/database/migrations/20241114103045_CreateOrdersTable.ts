import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrdersTable1672938475698 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "orders",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "255",
            isPrimary: true,
          },
          {
            name: "amount",
            type: "decimal",
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: "currencyCode",
            type: "varchar",
            length: "3",
            isNullable: false,
          },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    await queryRunner.query(
      "ALTER TABLE `orders` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("orders");
  }
}