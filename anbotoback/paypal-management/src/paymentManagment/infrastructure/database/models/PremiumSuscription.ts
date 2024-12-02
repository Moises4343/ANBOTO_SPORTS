import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("premium_subscriptions")
export class PremiumSubscription {
  @PrimaryColumn("uuid")
  id!: string; // Cambiado para coincidir con la migración

  @Column("varchar", { length: 36 })
  userId!: string; // Cambiado a varchar(36) para coincidir con la migración

  @Column("varchar", { length: 255 })
  orderId!: string; // ID de la orden creada en PayPal

  @Column("varchar", { length: 255 })
  transactionId!: string; // ID de la transacción capturada (opcional)

  @Column({ type: "timestamp"})
  startDate!: Date; // Fecha de inicio de la suscripción

  @Column({ type: "timestamp",  })
  endDate!: Date; // Fecha de fin de la suscripción

  @CreateDateColumn()
  createdAt!: Date; // Fecha de creación del registro

  @UpdateDateColumn()
  updatedAt!: Date; // Fecha de última actualización
}