"use client";
import { useState, ReactNode } from "react";

// --- Type Definitions ---
type ButtonColor = "primary" | "secondary" | "accent" | "error" | "black";
type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "solid" | "outline";
type Roundness = "none" | "sm" | "md" | "lg" | "full";
type CardRoundness = "sm" | "md" | "lg" | "xl";
type ShadowSize = "sm" | "md" | "lg" | "xl" | "2xl";
type AlertColor = "success" | "warning" | "error" | "info";
type ModalSize = "sm" | "md" | "lg";
type InputVariant = "default" | "success" | "error";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: ButtonColor;
  size?: ButtonSize;
  variant?: ButtonVariant;
  rounded?: Roundness;
  fullWidth?: boolean;
  isIconOnly?: boolean;
  className?: string;
}

interface AlertProps {
  color?: AlertColor;
  title: string;
  children: ReactNode;
  rounded?: Roundness;
  className?: string;
}

interface CardProps {
  children: ReactNode;
  rounded?: CardRoundness;
  shadow?: ShadowSize;
  className?: string;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  variant?: InputVariant;
  helperText?: string;
  rounded?: Roundness;
  fullWidth?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  rounded?: CardRoundness;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

interface HelperProps {
  children: ReactNode;
}

// --- Reusable Components ---

// Button Component
const Button: React.FC<ButtonProps> = ({
  children,
  color = "primary",
  size = "md",
  variant = "solid",
  rounded = "lg",
  fullWidth = false,
  isIconOnly = false,
  className = "",
  disabled = false,
  ...props
}) => {
  const baseClasses =
    "font-semibold transition-all duration-200 focus:outline-none flex items-center justify-center active:scale-95";

  const sizeClasses: Record<ButtonSize, string> = {
    sm: isIconOnly ? "p-1.5" : "px-4 py-1.5 text-sm",
    md: isIconOnly ? "p-2" : "px-6 py-2 text-base",
    lg: isIconOnly ? "p-3" : "px-8 py-3 text-lg",
  };

  const roundedClasses: Record<Roundness, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const colorClasses: Record<ButtonVariant, Record<ButtonColor, string>> = {
    solid: {
      primary:
        "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400 shadow-md hover:shadow-lg",
      secondary:
        "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400 shadow-md hover:shadow-lg",
      accent:
        "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400 shadow-md hover:shadow-lg",
      error:
        "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-md hover:shadow-lg",

      black:
        "bg-gray-500 text-white hover:bg-red-600 focus:ring-gray-400 shadow-md hover:shadow-lg",
    },
    outline: {
      primary:
        "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white focus:ring-blue-400",
      secondary:
        "bg-transparent border-2 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white focus:ring-gray-400",
      accent:
        "bg-transparent border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white focus:ring-emerald-400",
      error:
        "bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-400",
      black:
        "bg-transparent border-2 border-black text-black",
    },
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClasses = disabled
    ? "disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
    : "";

  const finalClasses = `${baseClasses} ${sizeClasses[size]} ${roundedClasses[rounded]} ${colorClasses[variant][color]} ${widthClass} ${disabledClasses} ${className}`;

  return (
    <button className={finalClasses} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

// Input Component
const Input: React.FC<InputProps> = ({
  label,
  variant = "default",
  helperText,
  rounded = "lg",
  fullWidth = true,
  className = "",
  ...props
}) => {
  const baseClasses =
    "px-4 py-2 border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-75";

  const roundedClasses: Record<Roundness, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const variantClasses: Record<InputVariant, string> = {
    default:
      "border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white",
    success:
      "border-green-500 bg-green-50 focus:ring-green-500 focus:border-green-500 dark:bg-green-900/20 dark:border-green-600 dark:text-white",
    error:
      "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500 dark:bg-red-900/20 dark:border-red-600 dark:text-white",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const finalClasses = `${baseClasses} ${roundedClasses[rounded]} ${variantClasses[variant]} ${widthClass} ${className}`;

  const labelColorClasses: Record<InputVariant, string> = {
    default: "text-gray-700 dark:text-gray-300",
    success: "text-green-700 dark:text-green-400",
    error: "text-red-700 dark:text-red-400",
  };

  const helperColorClasses: Record<InputVariant, string> = {
    default: "text-gray-600 dark:text-gray-400",
    success: "text-green-600 dark:text-green-400",
    error: "text-red-600 dark:text-red-400",
  };

  return (
    <div className="space-y-1">
      {label && (
        <label
          className={`block text-sm font-medium ${labelColorClasses[variant]}`}
        >
          {label}
        </label>
      )}
      <input className={finalClasses} {...props} />
      {helperText && (
        <p className={`text-sm ${helperColorClasses[variant]}`}>{helperText}</p>
      )}
    </div>
  );
};

// Alert Component
const Alert: React.FC<AlertProps> = ({
  color = "success",
  title,
  children,
  rounded = "md",
  className = "",
}) => {
  const colorClasses: Record<AlertColor, string> = {
    success:
      "bg-green-100 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-600 dark:text-green-300",
    warning:
      "bg-amber-100 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-600 dark:text-amber-300",
    error:
      "bg-red-100 border-red-500 text-red-700 dark:bg-red-900/20 dark:border-red-600 dark:text-red-300",
    info: "bg-blue-100 border-blue-500 text-blue-700 dark:bg-blue-900/20 dark:border-blue-600 dark:text-blue-300",
  };

  const roundedClasses: Record<Roundness, string> = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const iconClasses: Record<AlertColor, string> = {
    success: "✓",
    warning: "⚠",
    error: "✕",
    info: "ⓘ",
  };

  return (
    <div
      className={`border-l-4 p-4 ${roundedClasses[rounded]} ${colorClasses[color]} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <span className="text-lg mr-3 mt-0.5">{iconClasses[color]}</span>
        <div className="flex-1">
          <p className="font-bold mb-1">{title}</p>
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Card Component
const Card: React.FC<CardProps> = ({
  children,
  rounded = "xl",
  shadow = "md",
  className = "",
}) => {
  const roundedClasses: Record<CardRoundness, string> = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  const shadowClasses: Record<ShadowSize, string> = {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  };

  const finalClasses = `bg-white dark:bg-gray-800 overflow-hidden transition-shadow duration-200 hover:shadow-lg ${roundedClasses[rounded]} ${shadowClasses[shadow]} ${className}`;

  return <div className={finalClasses}>{children}</div>;
};

// Modal Component
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  size = "md",
  rounded = "lg",
  title,
  children,
  showCloseButton = true,
  className = "",
}) => {
  const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  };

  const roundedClasses: Record<CardRoundness, string> = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div onClick={onClose} className="absolute inset-0" />
      <div
        className={`bg-white dark:bg-gray-800 shadow-2xl w-full relative transform transition-all duration-200 ${sizeClasses[size]} ${roundedClasses[rounded]} ${className}`}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            {title && (
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const SectionTitle: React.FC<HelperProps> = ({ children }) => (
  <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
    {children}
  </h2>
);

const SubTitle: React.FC<HelperProps> = ({ children }) => (
  <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4 mt-8">
    {children}
  </h3>
);

const ComponentShowcase: React.FC<{
  title: string;
  children: ReactNode;
  code?: string;
}> = ({ title, children, code }) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h4>
        <div className="flex gap-2">
          {code && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? "Hide Code" : "Show Code"}
            </Button>
          )}
          {code && (
            <Button size="sm" color="accent" onClick={copyCode}>
              {copied ? "Copied!" : "Copy"}
            </Button>
          )}
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        {children}
      </div>

      {showCode && code && (
        <pre className="mt-4 bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
};

// --- Style Guide Sections ---

const ColorPalette: React.FC = () => {
  const colors = [
    {
      name: "Primary",
      shades: [
        { name: "Light", hex: "#93C5FD", className: "bg-blue-300" },
        { name: "Default", hex: "#3B82F6", className: "bg-blue-500" },
        { name: "Dark", hex: "#2563EB", className: "bg-blue-600" },
      ],
    },
    {
      name: "Accent",
      shades: [
        { name: "Light", hex: "#6EE7B7", className: "bg-emerald-300" },
        { name: "Default", hex: "#10B981", className: "bg-emerald-500" },
        { name: "Dark", hex: "#059669", className: "bg-emerald-600" },
      ],
    },
    {
      name: "Success",
      shades: [
        { name: "Light", hex: "#86EFAC", className: "bg-green-300" },
        { name: "Default", hex: "#22C55E", className: "bg-green-500" },
        { name: "Dark", hex: "#16A34A", className: "bg-green-600" },
      ],
    },
    {
      name: "Warning",
      shades: [
        { name: "Light", hex: "#FCD34D", className: "bg-amber-300" },
        { name: "Default", hex: "#F59E0B", className: "bg-amber-500" },
        { name: "Dark", hex: "#D97706", className: "bg-amber-600" },
      ],
    },
    {
      name: "Error",
      shades: [
        { name: "Light", hex: "#FCA5A5", className: "bg-red-300" },
        { name: "Default", hex: "#EF4444", className: "bg-red-500" },
        { name: "Dark", hex: "#DC2626", className: "bg-red-600" },
      ],
    },
  ];

  return (
    <div>
      <SectionTitle>Color Palette</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {colors.map((color) => (
          <Card key={color.name} className="p-6">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {color.name}
            </h4>
            <div className="flex flex-col gap-2">
              {color.shades.map((shade) => (
                <div
                  key={shade.name}
                  className="flex items-center gap-2 space-x-3"
                >
                  <div
                    className={`w-12 h-12 rounded-lg shadow-sm ${shade.className}`}
                  />
                  <div>
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                      {shade.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {shade.hex}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ButtonGuide: React.FC = () => (
  <div>
    <SectionTitle>Buttons</SectionTitle>

    <ComponentShowcase
      title="Button Variants"
      code={`<Button color="primary" variant="solid">Primary</Button>
<Button color="secondary" variant="solid">Secondary</Button>
<Button color="accent" variant="outline">Accent Outline</Button>
<Button color="error" variant="solid">Error</Button>`}
    >
      <div className="flex flex-wrap gap-4">
        <Button color="primary" variant="solid">
          Primary
        </Button>
        <Button color="secondary" variant="solid">
          Secondary
        </Button>
        <Button color="black" variant="outline">
          Accent Outline
        </Button>
        <Button color="error" variant="solid">
          Error
        </Button>
      </div>
    </ComponentShowcase>

    <ComponentShowcase
      title="Button Sizes"
      code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
    >
      <div className="flex flex-wrap gap-4 items-center">
        <Button size="sm">Small</Button>
        <Button size="md">Medium</Button>
        <Button size="lg">Large</Button>
      </div>
    </ComponentShowcase>

    <ComponentShowcase
      title="Icon Buttons"
      code={`<Button size="sm" isIconOnly>
  <svg className="w-4 h-4" fill="none" stroke="currentColor">...</svg>
</Button>
<Button size="md" isIconOnly color="accent" rounded="full">
  <svg className="w-5 h-5" fill="none" stroke="currentColor">...</svg>
</Button>`}
    >
      <div className="flex flex-wrap gap-4">
        <Button size="sm" isIconOnly>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Button>
        <Button size="md" isIconOnly color="accent" rounded="full">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </Button>
        <Button size="lg" isIconOnly color="error" variant="outline">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
    </ComponentShowcase>

    <ComponentShowcase
      title="Full Width Button"
      code={`<Button fullWidth>Full Width Button</Button>`}
    >
      <Button fullWidth>Full Width Button</Button>
    </ComponentShowcase>
  </div>
);

const InputGuide: React.FC = () => (
  <div>
    <SectionTitle>Form Inputs</SectionTitle>

    <ComponentShowcase
      title="Input Variants"
      code={`<Input label="Default Input" placeholder="Enter text..." />
<Input label="Success State" variant="success" defaultValue="Valid input" helperText="This is correct!" />
<Input label="Error State" variant="error" defaultValue="Invalid input" helperText="Please correct this field" />`}
    >
      <div className="space-y-6 max-w-md">
        <Input label="Default Input" placeholder="Enter text..." />
        <Input
          label="Success State"
          variant="success"
          defaultValue="Valid input"
          helperText="This is correct!"
        />
        <Input
          label="Error State"
          variant="error"
          defaultValue="Invalid input"
          helperText="Please correct this field"
        />
      </div>
    </ComponentShowcase>

    <ComponentShowcase
      title="Input Sizes & Roundness"
      code={`<Input label="Rounded Input" rounded="full" placeholder="Fully rounded input" />
<Input label="Square Input" rounded="none" placeholder="No border radius" />`}
    >
      <div className="space-y-4 max-w-md">
        <Input
          label="Rounded Input"
          rounded="full"
          placeholder="Fully rounded input"
        />
        <Input
          label="Square Input"
          rounded="none"
          placeholder="No border radius"
        />
      </div>
    </ComponentShowcase>
  </div>
);

const CardGuide: React.FC = () => (
  <div>
    <SectionTitle>Cards</SectionTitle>

    <ComponentShowcase
      title="Card Shadows"
      code={`<Card shadow="sm">Small Shadow</Card>
<Card shadow="lg">Large Shadow</Card>
<Card shadow="2xl">2XL Shadow</Card>`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card shadow="sm">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Small Shadow
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Subtle elevation effect
            </p>
          </div>
        </Card>
        <Card shadow="lg">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Large Shadow
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              More prominent elevation
            </p>
          </div>
        </Card>
        <Card shadow="2xl">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              2XL Shadow
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Maximum elevation effect
            </p>
          </div>
        </Card>
      </div>
    </ComponentShowcase>

    <ComponentShowcase
      title="Card Roundness"
      code={`<Card rounded="sm">Small Radius</Card>
<Card rounded="lg">Large Radius</Card>
<Card rounded="xl">XL Radius</Card>`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card rounded="sm">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Small Radius
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Subtle corner rounding
            </p>
          </div>
        </Card>
        <Card rounded="lg">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Large Radius
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Moderate corner rounding
            </p>
          </div>
        </Card>
        <Card rounded="xl">
          <div className="p-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              XL Radius
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Maximum corner rounding
            </p>
          </div>
        </Card>
      </div>
    </ComponentShowcase>
  </div>
);

const AlertGuide: React.FC = () => (
  <div>
    <SectionTitle>Alerts</SectionTitle>

    <ComponentShowcase
      title="Alert Types"
      code={`<Alert color="success" title="Success">Your action was completed successfully.</Alert>
<Alert color="warning" title="Warning">Please be aware of this important information.</Alert>
<Alert color="error" title="Error">Something went wrong. Please try again.</Alert>
<Alert color="info" title="Information">This is for your general information.</Alert>`}
    >
      <div className="space-y-4">
        <Alert color="success" title="Success">
          Your action was completed successfully.
        </Alert>
        <Alert color="warning" title="Warning">
          Please be aware of this important information.
        </Alert>
        <Alert color="error" title="Error">
          Something went wrong. Please try again.
        </Alert>
        <Alert color="info" title="Information">
          This is for your general information.
        </Alert>
      </div>
    </ComponentShowcase>
  </div>
);

const ModalGuide: React.FC = () => {
  const [modals, setModals] = useState({
    small: false,
    medium: false,
    large: false,
  });

  const openModal = (type: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modals) => {
    setModals((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <div>
      <SectionTitle>Modals</SectionTitle>

      <ComponentShowcase
        title="Modal Sizes"
        code={`<Modal isOpen={isOpen} onClose={closeModal} size="sm" title="Small Modal">
  <p>This is a small modal with limited content.</p>
</Modal>

<Modal isOpen={isOpen} onClose={closeModal} size="md" title="Medium Modal">
  <p>This is a medium-sized modal for regular content.</p>
</Modal>

<Modal isOpen={isOpen} onClose={closeModal} size="lg" title="Large Modal">
  <p>This is a large modal for extensive content and forms.</p>
</Modal>`}
      >
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => openModal("small")} color="secondary">
            Open Small Modal
          </Button>
          <Button onClick={() => openModal("medium")}>Open Medium Modal</Button>
          <Button onClick={() => openModal("large")} color="accent">
            Open Large Modal
          </Button>
        </div>
      </ComponentShowcase>

      {/* Modal Components */}
      <Modal
        isOpen={modals.small}
        onClose={() => closeModal("small")}
        size="sm"
        title="Small Modal"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This is a small modal perfect for quick confirmations or simple
          messages.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => closeModal("small")}>
            Cancel
          </Button>
          <Button onClick={() => closeModal("small")}>Confirm</Button>
        </div>
      </Modal>

      <Modal
        isOpen={modals.medium}
        onClose={() => closeModal("medium")}
        size="md"
        title="Medium Modal"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This is a medium-sized modal suitable for forms and detailed content.
        </p>
        <div className="space-y-4 mb-6">
          <Input label="Name" placeholder="Enter your name" />
          <Input label="Email" type="email" placeholder="Enter your email" />
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => closeModal("medium")}>
            Cancel
          </Button>
          <Button onClick={() => closeModal("medium")}>Save</Button>
        </div>
      </Modal>

      <Modal
        isOpen={modals.large}
        onClose={() => closeModal("large")}
        size="lg"
        title="Large Modal"
      >
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This is a large modal with plenty of space for complex forms and
          extensive content.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input label="First Name" placeholder="Enter first name" />
          <Input label="Last Name" placeholder="Enter last name" />
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            fullWidth
          />
          <Input label="Phone" type="tel" placeholder="Enter phone number" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={4}
            placeholder="Enter description..."
          />
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => closeModal("large")}>
            Cancel
          </Button>
          <Button onClick={() => closeModal("large")}>Submit</Button>
        </div>
      </Modal>
    </div>
  );
};

const TypographyGuide: React.FC = () => (
  <div>
    <SectionTitle>Typography</SectionTitle>
    <ComponentShowcase
      title="Heading Styles"
      code={`<h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">Heading 1</h1>
<h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">Heading 2</h2>
<h3 className="text-3xl font-semibold text-gray-700 dark:text-gray-300">Heading 3</h3>
<p className="text-base text-gray-700 dark:text-gray-300">Body text paragraph</p>`}
    >
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white">
          Heading 1 (H1)
        </h1>
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
          Heading 2 (H2)
        </h2>
        <h3 className="text-3xl font-semibold text-gray-700 dark:text-gray-300">
          Heading 3 (H3)
        </h3>
        <h4 className="text-2xl font-medium text-gray-600 dark:text-gray-400">
          Heading 4 (H4)
        </h4>
        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-prose">
          Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Sed non risus. Suspendisse lectus tortor, dignissim sit amet,
          adipiscing nec, ultricies sed, dolor.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Small text - Additional information or disclaimers.
        </p>
      </div>
    </ComponentShowcase>
  </div>
);

// --- Main Style Guide Component ---
const StyleGuide: React.FC = () => {
  return (
    <div className=" dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Design System Style Guide
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive collection of reusable components with full variant
            support for your Next.js project.
          </p>
        </header>

        <main className="space-y-16">
          <ColorPalette />
          <TypographyGuide />
          <ButtonGuide />
          <InputGuide />
          <CardGuide />
          <AlertGuide />
          <ModalGuide />
        </main>

        <footer className="mt-16 text-center">
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Ready to Use Components
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              All components are fully typed, accessible, and ready for
              production use. Simply copy the component code and customize as
              needed for your project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button color="primary">Get Started</Button>
              <Button variant="outline" color="secondary">
                Documentation
              </Button>
            </div>
          </Card>
        </footer>
      </div>
    </div>
  );
};

export default StyleGuide;
