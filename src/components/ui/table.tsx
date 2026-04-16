import * as React from 'react'
import { cn } from '@/lib/utils'

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  className?: string
  children: React.ReactNode
}

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
  children: React.ReactNode
}

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  className?: string
  children: React.ReactNode
}

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  className?: string
  children: React.ReactNode
}

interface TableCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  className?: string
  children: React.ReactNode
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => {
    return (
      <table
        className={cn('w-full border-collapse', className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <thead className={cn(className)} ref={ref} {...props} />
    )
  }
)
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ className, ...props }, ref) => {
    return (
      <tbody className={cn(className)} ref={ref} {...props} />
    )
  }
)
TableBody.displayName = 'TableBody'

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => {
    return (
      <tr className={cn('border-b', className)} ref={ref} {...props} />
    )
  }
)
TableRow.displayName = 'TableRow'

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => {
    return (
      <td className={cn('px-4 py-2 align-middle', className)} ref={ref} {...props} />
    )
  }
)
TableCell.displayName = 'TableCell'

export { Table, TableHeader, TableBody, TableRow, TableCell }
