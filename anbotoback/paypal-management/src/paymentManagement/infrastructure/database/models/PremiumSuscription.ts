import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity("premium_subscriptions")
export class PremiumSubscription {
  @PrimaryColumn("uuid")
  id!: string; 

  @Column("varchar", { length: 36 })
  userId!: string; 

  @Column("varchar", { length: 255 })
  orderId!: string; 

  @Column("varchar", { length: 255 })
  transactionId!: string; 

  @Column({ type: "timestamp"})
  startDate!: Date;

  @Column({ type: "timestamp",  })
  endDate!: Date; 

  @CreateDateColumn()
  createdAt!: Date; 

  @UpdateDateColumn()
  updatedAt!: Date; 
}