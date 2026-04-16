import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
}

interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
  className?: string
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
  className?: string
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultValue, value, onValueChange, className, children, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState(value || defaultValue)

    const handleTabChange = (tabValue: string) => {
      setActiveTab(tabValue)
      onValueChange?.(tabValue)
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            {React.Children.map(children, (child, index) => {
              if (React.isValidElement(child) && child.type === TabsTrigger) {
                return (
                  <button
                    key={index}
                    onClick={() => handleTabChange(child.props.value)}
                    className={cn(
                      'whitespace-nowrap py-2 px-1 text-sm font-medium rounded-md',
                      activeTab === child.props.value
                        ? 'bg-primary text-primary-foreground border-b-2 border-primary'
                        : 'text-muted-foreground hover:text-foreground border-transparent'
                    )}
                    {...child.props}
                  >
                    {child.props.children}
                  </button>
                )
              }
              return null
            })}
          </nav>
        </div>
        <div>
          {React.Children.map(children, (child, index) => {
            if (React.isValidElement(child) && child.type === TabsContent) {
              return (
                <div
                  key={index}
                  className={cn(
                    'py-4',
                    activeTab === child.props.value ? 'block' : 'hidden'
                  )}
                  {...child.props}
                >
                  {child.props.children}
                </div>
              )
            }
            return null
          })}
        </div>
      </div>
    )
  }
)
Tabs.displayName = 'Tabs'

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('flex space-x-1', className)} {...props}>
        {children}
      </div>
    )
  }
)
TabsList.displayName = 'TabsList'

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn('', className)} {...props}>
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    )
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
