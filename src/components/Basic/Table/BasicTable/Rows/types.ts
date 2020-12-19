export interface BasicTableRowsProps {
  content: any,
  index: number,
  collapseContents?: string[]
  transformValue?: (header: string, content: any) => string
  headers: string[],
  title?: string
}