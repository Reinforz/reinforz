export interface BasicTableFooterProps<T = Record<string, any>> {
  contents: T[],
  collapseContents?: string[]
  transformValue?: (header: string, content: any) => string
  headers: string[],
  accumulator: (header: string, contents: Array<any>) => string | null | number,
}