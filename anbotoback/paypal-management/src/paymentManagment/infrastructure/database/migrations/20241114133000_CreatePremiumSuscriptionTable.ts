import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePremiumSubscriptionsTable20241114133001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "premium_subscriptions",
        columns: [
          {
            name: "id",
            type: "varchar",
            length: "36",
            isPrimary: true,
          },
          {
            name: "userId",
            type: "varchar",
            length: "36",
            isNullable: false,
          },
          {
            name: "orderId",
            type: "varchar",
            length: "255",
            isNullable: false, // Debe coincidir exactamente con `id` en `orders`
          },
          {
            name: "transactionId",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "startDate",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "endDate",
            type: "timestamp",
            isNullable: false,
            default: "'2030-01-01 00:00:00'",
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
      "ALTER TABLE `premium_subscriptions` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("premium_subscriptions");
  }
}