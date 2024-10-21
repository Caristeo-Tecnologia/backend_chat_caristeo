import {
    Table,
    Column,
    CreatedAt,
    UpdatedAt,
    Model,
    PrimaryKey,
    AutoIncrement,
    DataType,
    BelongsTo,
    ForeignKey
  } from "sequelize-typescript";
  import Company from "./Company";
  
  @Table
  class AsaasPayment extends Model<AsaasPayment> {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    asaasId: string;
  
    @Column
    subscription: string;

    @Column
    value: number;
    
    @Column
    invoiceUrl: string;
  
    @ForeignKey(() => Company)
    @Column
    companyId: number;
  
    @Column
    status: string;
  
    @CreatedAt
    createdAt: Date;
  
    @UpdatedAt
    updatedAt: Date;
  
    @BelongsTo(() => Company)
    company: Company;
  }
  
  export default AsaasPayment;
  