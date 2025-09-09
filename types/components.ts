/**
 * Strict TypeScript Component Props for BCNS Website
 * 
 * All component interfaces are strictly typed with no 'any' types.
 * Includes proper event handlers, children types, and validation.
 */

import { ReactNode, ComponentPropsWithoutRef, ElementType } from 'react';
import { User } from './api';

// Base component props
export interface BaseComponentProps {
  readonly className?: string;
  readonly children?: ReactNode;
  readonly id?: string;
  readonly 'data-testid'?: string;
}

// Loading states
export interface LoadingProps {
  readonly loading: boolean;
  readonly loadingText?: string;
  readonly size?: 'sm' | 'md' | 'lg';
}

// Error handling props
export interface ErrorProps {
  readonly error: Error | null;
  readonly onRetry?: () => void;
  readonly showDetails?: boolean;
}

// Form component props
export interface FormFieldProps extends BaseComponentProps {
  readonly label: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly helperText?: string;
}

export interface InputProps extends FormFieldProps {
  readonly type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number';
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly maxLength?: number;
  readonly minLength?: number;
  readonly pattern?: string;
  readonly autoComplete?: string;
}

export interface TextareaProps extends FormFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
  readonly rows?: number;
  readonly maxLength?: number;
  readonly minLength?: number;
  readonly resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export interface SelectProps extends FormFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly options: readonly SelectOption[];
  readonly placeholder?: string;
  readonly multiple?: boolean;
}

export interface SelectOption {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
  readonly group?: string;
}

export interface CheckboxProps extends FormFieldProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly indeterminate?: boolean;
}

export interface RadioProps extends FormFieldProps {
  readonly value: string;
  readonly checked: boolean;
  readonly onChange: (value: string) => void;
  readonly name: string;
}

// Button component props
export interface ButtonProps extends BaseComponentProps {
  readonly variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly onClick?: () => void;
  readonly href?: string;
  readonly target?: '_blank' | '_self' | '_parent' | '_top';
  readonly download?: string;
}

// Modal/Dialog props
export interface ModalProps extends BaseComponentProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly description?: string;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  readonly closeOnOverlayClick?: boolean;
  readonly closeOnEscape?: boolean;
  readonly showCloseButton?: boolean;
}

// Card component props
export interface CardProps extends BaseComponentProps {
  readonly variant?: 'default' | 'outlined' | 'elevated';
  readonly padding?: 'none' | 'sm' | 'md' | 'lg';
  readonly clickable?: boolean;
  readonly onClick?: () => void;
}

// Avatar component props
export interface AvatarProps extends BaseComponentProps {
  readonly src?: string;
  readonly alt: string;
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  readonly fallback?: string;
  readonly shape?: 'circle' | 'square';
  readonly status?: 'online' | 'offline' | 'away' | 'busy';
}

// Badge component props
export interface BadgeProps extends BaseComponentProps {
  readonly variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly dot?: boolean;
}

// Table component props
export interface TableColumn<T> {
  readonly key: keyof T;
  readonly title: string;
  readonly width?: string | number;
  readonly align?: 'left' | 'center' | 'right';
  readonly sortable?: boolean;
  readonly render?: (value: T[keyof T], record: T, index: number) => ReactNode;
}

export interface TableProps<T> extends BaseComponentProps {
  readonly data: readonly T[];
  readonly columns: readonly TableColumn<T>[];
  readonly loading?: boolean;
  readonly empty?: ReactNode;
  readonly rowKey: keyof T | ((record: T) => string);
  readonly onRowClick?: (record: T, index: number) => void;
  readonly selectable?: boolean;
  readonly selectedRows?: readonly T[];
  readonly onSelectionChange?: (selectedRows: readonly T[]) => void;
}

// Pagination props
export interface PaginationProps extends BaseComponentProps {
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly itemsPerPage: number;
  readonly onPageChange: (page: number) => void;
  readonly onItemsPerPageChange?: (itemsPerPage: number) => void;
  readonly showSizeChanger?: boolean;
  readonly showQuickJumper?: boolean;
  readonly showTotal?: boolean;
}

// Search component props
export interface SearchProps extends BaseComponentProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly onSearch?: (value: string) => void;
  readonly placeholder?: string;
  readonly loading?: boolean;
  readonly suggestions?: readonly string[];
  readonly onSuggestionSelect?: (suggestion: string) => void;
  readonly debounceMs?: number;
}

// File upload props
export interface FileUploadProps extends BaseComponentProps {
  readonly accept?: string;
  readonly multiple?: boolean;
  readonly maxSize?: number;
  readonly maxFiles?: number;
  readonly onFileSelect: (files: FileList) => void;
  readonly onError?: (error: string) => void;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly progress?: number;
  readonly dragAndDrop?: boolean;
}

// Navigation props
export interface NavItemProps {
  readonly label: string;
  readonly href?: string;
  readonly icon?: ReactNode;
  readonly active?: boolean;
  readonly disabled?: boolean;
  readonly badge?: string | number;
  readonly onClick?: () => void;
  readonly children?: readonly NavItemProps[];
}

export interface NavigationProps extends BaseComponentProps {
  readonly items: readonly NavItemProps[];
  readonly orientation?: 'horizontal' | 'vertical';
  readonly variant?: 'default' | 'pills' | 'underline';
  readonly onItemClick?: (item: NavItemProps) => void;
}

// Breadcrumb props
export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
  readonly onClick?: () => void;
}

export interface BreadcrumbProps extends BaseComponentProps {
  readonly items: readonly BreadcrumbItem[];
  readonly separator?: ReactNode;
  readonly maxItems?: number;
}

// Toast/Notification props
export interface ToastProps {
  readonly id: string;
  readonly type: 'success' | 'error' | 'warning' | 'info';
  readonly title: string;
  readonly message?: string;
  readonly duration?: number;
  readonly closable?: boolean;
  readonly onClose?: () => void;
  readonly action?: {
    readonly label: string;
    readonly onClick: () => void;
  };
}

// Layout component props
export interface LayoutProps extends BaseComponentProps {
  readonly header?: ReactNode;
  readonly sidebar?: ReactNode;
  readonly footer?: ReactNode;
  readonly sidebarCollapsed?: boolean;
  readonly onSidebarToggle?: () => void;
}

// User-specific component props
export interface UserProfileProps extends BaseComponentProps {
  readonly user: User;
  readonly editable?: boolean;
  readonly onEdit?: () => void;
  readonly onSave?: (data: Partial<User>) => Promise<void>;
  readonly loading?: boolean;
  readonly error?: Error | null;
}

export interface UserListProps extends BaseComponentProps {
  readonly users: readonly User[];
  readonly loading?: boolean;
  readonly error?: Error | null;
  readonly onUserSelect?: (user: User) => void;
  readonly onUserEdit?: (user: User) => void;
  readonly onUserDelete?: (user: User) => void;
  readonly selectable?: boolean;
  readonly selectedUsers?: readonly User[];
  readonly onSelectionChange?: (users: readonly User[]) => void;
}

// Form validation props
export interface ValidationRule {
  readonly required?: boolean;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: RegExp;
  readonly custom?: (value: string) => string | null;
}

export interface FormValidationProps {
  readonly rules?: Record<string, ValidationRule>;
  readonly onValidationChange?: (isValid: boolean, errors: Record<string, string>) => void;
}

// API integration props
export interface ApiComponentProps<T> extends BaseComponentProps {
  readonly data?: T;
  readonly loading?: boolean;
  readonly error?: Error | null;
  readonly onRefresh?: () => void;
  readonly onRetry?: () => void;
}

// Generic list component props
export interface ListProps<T> extends BaseComponentProps {
  readonly items: readonly T[];
  readonly renderItem: (item: T, index: number) => ReactNode;
  readonly keyExtractor: (item: T, index: number) => string;
  readonly loading?: boolean;
  readonly empty?: ReactNode;
  readonly error?: Error | null;
  readonly onRetry?: () => void;
}

// Polymorphic component props
export type PolymorphicProps<E extends ElementType> = {
  readonly as?: E;
} & ComponentPropsWithoutRef<E>;

// Higher-order component props
export interface WithLoadingProps {
  readonly loading: boolean;
  readonly skeleton?: ReactNode;
}

export interface WithErrorProps {
  readonly error: Error | null;
  readonly fallback?: ReactNode;
  readonly onRetry?: () => void;
}

// Theme and styling props
export interface ThemeProps {
  readonly theme?: 'light' | 'dark' | 'auto';
  readonly colorScheme?: 'blue' | 'green' | 'purple' | 'orange';
}

// Accessibility props
export interface A11yProps {
  readonly 'aria-label'?: string;
  readonly 'aria-labelledby'?: string;
  readonly 'aria-describedby'?: string;
  readonly 'aria-expanded'?: boolean;
  readonly 'aria-hidden'?: boolean;
  readonly role?: string;
  readonly tabIndex?: number;
}

// Event handler types
export type ClickHandler = () => void;
export type ChangeHandler<T> = (value: T) => void;
export type SubmitHandler<T> = (data: T) => void | Promise<void>;
export type ErrorHandler = (error: Error) => void;

// Utility types for component props
export type RequiredProps<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type OptionalProps<T, K extends keyof T> = T & Partial<Pick<T, K>>;
export type StrictProps<T> = {
  readonly [K in keyof T]-?: T[K];
};

// Component state types
export interface ComponentState<T> {
  readonly data: T | null;
  readonly loading: boolean;
  readonly error: Error | null;
}

export interface AsyncComponentState<T> extends ComponentState<T> {
  readonly lastUpdated: Date | null;
  readonly retryCount: number;
}

// Form state types
export interface FormState<T> {
  readonly values: T;
  readonly errors: Partial<Record<keyof T, string>>;
  readonly touched: Partial<Record<keyof T, boolean>>;
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
}

// Export utility functions for type checking
export function isValidComponentProps<T extends BaseComponentProps>(
  props: unknown
): props is T {
  return typeof props === 'object' && props !== null;
}

export function assertComponentProps<T extends BaseComponentProps>(
  props: unknown,
  componentName: string
): asserts props is T {
  if (!isValidComponentProps(props)) {
    throw new Error(`Invalid props for component ${componentName}`);
  }
}
