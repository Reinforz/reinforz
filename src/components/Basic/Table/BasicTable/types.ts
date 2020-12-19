export interface BasicTableProps<Values> {
  contents: Values[],
  accumulator: (header: string, contents: Array<any>) => string | null | number,
  className?: string,
  onHeaderClick: (header: string, order: "ASC" | "DESC") => any,
  collapseContents?: string[]
  transformValue?: (header: string, content: any) => string
  headers: string[],
  title?: string
}