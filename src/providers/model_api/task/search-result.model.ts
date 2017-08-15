export interface SearchResult<T> {
    pageSize: number;
    pageIndex: number;
    total: number;
    _body:string;
    result: T[];
}
