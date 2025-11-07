// T021: Service card block component - reusable UI for service display
import { ServiceItem } from '@/shared/data/mock-services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/base/card';

// Hooks
// (none)

// Translations
// (none - content comes from props)

// Data Loading
// (none - displays provided data)

// Early Returns
// (none)

// Computed Data
// (none)

// Event Handlers
// (none)

// Effects
// (none)

export interface ServiceCardProps {
  service: ServiceItem;
  className?: string;
}

export function ServiceCard({ service, className }: ServiceCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {service.iconName && (
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              {/* Icon placeholder - will be replaced with actual icons */}
              <div className="w-4 h-4 bg-primary rounded-sm" />
            </div>
          )}
          <span>{service.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{service.description}</p>
      </CardContent>
    </Card>
  );
}