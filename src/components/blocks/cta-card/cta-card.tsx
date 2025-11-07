// T025: CTA card block component for call-to-action sections

// Hooks
const useCTACard = (href?: string) => {
  const handleClick = () => {
    if (href) {
      window.location.href = href;
    }
  };

  return { handleClick };
};

// Translations
// No translations needed - content passed as props

// Data Loading
// No data loading needed - pure UI component

// Early Returns
// No early returns needed

// Computed Data
// No computed data needed

// Event Handlers
// Handled in hook

// Effects
// No effects needed

// Types
export interface CTACardProps {
  title: string;
  description: string;
  buttonText: string;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function CTACard({
  title,
  description,
  buttonText,
  href,
  variant = 'primary',
  className = ''
}: CTACardProps) {
  const { handleClick } = useCTACard(href);

  return (
    <div className={`rounded-lg border p-6 text-center ${variant === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground'} ${className}`}>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90 mb-4">{description}</p>
      <button
        onClick={handleClick}
        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
          variant === 'primary'
            ? 'bg-white text-primary hover:bg-gray-100'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}