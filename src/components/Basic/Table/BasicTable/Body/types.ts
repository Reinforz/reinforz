export interface BasicTableBodyProps<T = Record<string, any>> {
  contents: T[],
  collapseContents?: string[]
  transformValue?: (header: string, content: any) => string
  headers: string[],
  title?: string
}