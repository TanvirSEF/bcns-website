export interface MembershipFormData {
  // Form identification
  formNo: string;
  refNo: string;

  // Personal Information
  name: string;
  affiliation: string;
  phone: string;
  email: string;
  mailingAddress: string;
  permanentAddress: string;

  // Education Qualifications
  mbbsYear: string;
  mbbsInstitution: string;
  fcpsMdYear: string;
  fcpsMdInstitution: string;
  mdFcpsYear: string;
  mdFcpsInstitution: string;
  additionalDegree: string;
  additionalYear: string;
  additionalInstitution: string;

  // Training
  training1Period: string;
  training1Institute: string;
  training2Period: string;
  training2Institute: string;
  training3Period: string;
  training3Institute: string;

  // Research Interests
  researchInterest1: string;
  researchInterest2: string;

  // Photo upload
  photo: File | null;
}

export interface MembershipSubmissionResponse {
  success: boolean;
  message: string;
  applicationId?: string;
  timestamp: string;
  errors?: string[];
}

export interface MembershipApiError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}

export type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export interface FormValidationState {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
}

/**
 * Field validation result
 */
export interface FieldValidation {
  isValid: boolean;
  error?: string;
}

export interface FileUploadConfig {
  maxSize: number; // in bytes
  allowedTypes: string[];
  maxFiles: number;
}

/**
 * File upload state
 */
export interface FileUploadState {
  file: File | null;
  isUploading: boolean;
  progress: number;
  error?: string;
}

export type FormFieldType =
  | "text"
  | "email"
  | "tel"
  | "textarea"
  | "file"
  | "select"
  | "date";

/**
 * Form section configuration
 */
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  isRequired: boolean;
}

/**
 * Form field configuration
 */
export interface FormField {
  name: keyof MembershipFormData;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRules;
  options?: Array<{ value: string; label: string }>;
}

export const DEFAULT_MEMBERSHIP_FORM_DATA: MembershipFormData = {
  formNo: "",
  refNo: "",
  name: "",
  affiliation: "",
  phone: "",
  email: "",
  mailingAddress: "",
  permanentAddress: "",
  mbbsYear: "",
  mbbsInstitution: "",
  fcpsMdYear: "",
  fcpsMdInstitution: "",
  mdFcpsYear: "",
  mdFcpsInstitution: "",
  additionalDegree: "",
  additionalYear: "",
  additionalInstitution: "",
  training1Period: "",
  training1Institute: "",
  training2Period: "",
  training2Institute: "",
  training3Period: "",
  training3Institute: "",
  researchInterest1: "",
  researchInterest2: "",
  photo: null,
};

/**
 * File upload configuration
 */
export const MEMBERSHIP_FILE_CONFIG: FileUploadConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  maxFiles: 1,
};

/**
 * Form sections configuration
 */
export const MEMBERSHIP_FORM_SECTIONS: FormSection[] = [
  {
    id: "personal-info",
    title: "Personal Information",
    description: "Please provide your basic personal information",
    isRequired: true,
    fields: [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter your full name",
        required: true,
        validation: { required: true, minLength: 2 },
      },
      {
        name: "affiliation",
        label: "Affiliation",
        type: "text",
        placeholder: "Your institution/hospital",
        required: true,
        validation: { required: true },
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "tel",
        placeholder: "Enter phone number",
        required: true,
        validation: { required: true, phone: true },
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "Enter email address",
        required: true,
        validation: { required: true, email: true },
      },
      {
        name: "mailingAddress",
        label: "Mailing Address",
        type: "textarea",
        placeholder: "Enter your mailing address",
        required: true,
        validation: { required: true },
      },
      {
        name: "permanentAddress",
        label: "Permanent Address",
        type: "textarea",
        placeholder: "Enter your permanent address",
        required: true,
        validation: { required: true },
      },
    ],
  },
  {
    id: "education",
    title: "Education Qualification",
    description: "Please provide your educational background",
    isRequired: true,
    fields: [
      {
        name: "mbbsYear",
        label: "MBBS Year",
        type: "text",
        placeholder: "Year",
        validation: { pattern: /^\d{4}$/ },
      },
      {
        name: "mbbsInstitution",
        label: "MBBS Institution",
        type: "text",
        placeholder: "Institution",
      },
      {
        name: "fcpsMdYear",
        label: "FCPS/MD Year",
        type: "text",
        placeholder: "Year",
        validation: { pattern: /^\d{4}$/ },
      },
      {
        name: "fcpsMdInstitution",
        label: "FCPS/MD Institution",
        type: "text",
        placeholder: "Institution",
      },
      {
        name: "mdFcpsYear",
        label: "MD/FCPS Year",
        type: "text",
        placeholder: "Year",
        validation: { pattern: /^\d{4}$/ },
      },
      {
        name: "mdFcpsInstitution",
        label: "MD/FCPS Institution",
        type: "text",
        placeholder: "Institution",
      },
    ],
  },
  {
    id: "training",
    title: "Training",
    description: "Please provide your training information",
    isRequired: false,
    fields: [
      {
        name: "training1Period",
        label: "Training Period 1",
        type: "text",
        placeholder: "Training period",
      },
      {
        name: "training1Institute",
        label: "Training Institute 1",
        type: "text",
        placeholder: "Training institute",
      },
      {
        name: "training2Period",
        label: "Training Period 2",
        type: "text",
        placeholder: "Training period",
      },
      {
        name: "training2Institute",
        label: "Training Institute 2",
        type: "text",
        placeholder: "Training institute",
      },
      {
        name: "training3Period",
        label: "Training Period 3",
        type: "text",
        placeholder: "Training period",
      },
      {
        name: "training3Institute",
        label: "Training Institute 3",
        type: "text",
        placeholder: "Training institute",
      },
    ],
  },
  {
    id: "research",
    title: "Research Interests",
    description: "Please describe your research interests",
    isRequired: false,
    fields: [
      {
        name: "researchInterest1",
        label: "Primary Research Interest",
        type: "textarea",
        placeholder: "Describe your primary research interest",
      },
      {
        name: "researchInterest2",
        label: "Secondary Research Interest",
        type: "textarea",
        placeholder: "Describe your secondary research interest (optional)",
      },
    ],
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates phone number format (basic validation)
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

/**
 * Validates year format (4 digits)
 */
export const validateYear = (year: string): boolean => {
  const yearRegex = /^\d{4}$/;
  return yearRegex.test(year);
};

/**
 * Validates file upload
 */
export const validateFile = (
  file: File,
  config: FileUploadConfig
): FieldValidation => {
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  if (file.size > config.maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${config.maxSize / (1024 * 1024)}MB`,
    };
  }

  if (!config.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${config.allowedTypes.join(
        ", "
      )}`,
    };
  }

  return { isValid: true };
};

/**
 * Validates a form field based on validation rules
 */
export const validateField = (
  value: string,
  rules: ValidationRules
): FieldValidation => {
  if (rules.required && !value.trim()) {
    return { isValid: false, error: "This field is required" };
  }

  if (rules.minLength && value.length < rules.minLength) {
    return {
      isValid: false,
      error: `Minimum length is ${rules.minLength} characters`,
    };
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return {
      isValid: false,
      error: `Maximum length is ${rules.maxLength} characters`,
    };
  }

  if (rules.email && !validateEmail(value)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  if (rules.phone && !validatePhone(value)) {
    return { isValid: false, error: "Please enter a valid phone number" };
  }

  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: "Please enter a valid value" };
  }

  return { isValid: true };
};

/**
 * Validates entire form data
 */
export const validateForm = (data: MembershipFormData): FormValidationState => {
  const errors: Record<string, string> = {};
  const touched: Record<string, boolean> = {};

  // Validate required fields
  const requiredFields: (keyof MembershipFormData)[] = [
    "name",
    "affiliation",
    "phone",
    "email",
    "mailingAddress",
    "permanentAddress",
  ];

  requiredFields.forEach((field) => {
    touched[field] = true;
    const validation = validateField(data[field] as string, { required: true });
    if (!validation.isValid) {
      errors[field] = validation.error!;
    }
  });

  // Validate email format
  if (data.email) {
    const emailValidation = validateField(data.email, { email: true });
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    }
  }

  // Validate phone format
  if (data.phone) {
    const phoneValidation = validateField(data.phone, { phone: true });
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!;
    }
  }

  // Validate years
  const yearFields = ["mbbsYear", "fcpsMdYear", "mdFcpsYear", "additionalYear"];
  yearFields.forEach((field) => {
    if (data[field as keyof MembershipFormData]) {
      const yearValidation = validateField(
        data[field as keyof MembershipFormData] as string,
        { pattern: /^\d{4}$/ }
      );
      if (!yearValidation.isValid) {
        errors[field] = "Please enter a valid 4-digit year";
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    touched,
  };
};
