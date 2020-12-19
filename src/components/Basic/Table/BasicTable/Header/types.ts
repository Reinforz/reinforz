export interface BasicTableHeaderProps {
  headers: string[],
  collapseContents?: string[]
  onHeaderClick: (header: string, order: "ASC" | "DESC") => any,
}