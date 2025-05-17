import { WhereFilterOp } from "@angular/fire/firestore";

export interface ICollectionOptions {
    field: string,
    opStr: WhereFilterOp,
    value: any
}
