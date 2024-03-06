export interface Pricing {
    id?:number;
    price: number;
    dateCreation?: string;
    dateUpdate?: string;
    createdBy?: string;
    updatedBy?: string;
    active?: boolean;
    description?: string;
    effectiveDate: Date;
    expirationDate: Date;
}