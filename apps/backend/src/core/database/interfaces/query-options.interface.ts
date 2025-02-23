export interface QueryOptions {
    where?: WhereClause[];
    orderBy?: OrderByClause[];
    limit?: number;
    offset?: number;
    startAfter?: any;
  }
  
  interface WhereClause {
    field: string;
    operator: WhereOperator;
    value: any;
  }
  
  type WhereOperator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'array-contains' | 'in' | 'not-in';
  
  interface OrderByClause {
    field: string;
    direction: 'asc' | 'desc';
  }
