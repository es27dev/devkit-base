// Types
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface FileConversionResult {
  success: boolean;
  base64?: string;
  fileName?: string;
  error?: string;
}

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPE = "application/pdf";

// Service: Validate CV file
export function validateCVFile(file: File): FileValidationResult {
  // Check file type
  if (file.type !== ALLOWED_MIME_TYPE) {
    return {
      isValid: false,
      error: "Nur PDF-Dateien erlaubt",
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: "Datei zu groß (max. 10MB)",
    };
  }

  // Check if file has content
  if (file.size === 0) {
    return {
      isValid: false,
      error: "Datei ist leer",
    };
  }

  return {
    isValid: true,
  };
}

// Service: Convert file to base64
export function fileToBase64(file: File): Promise<FileConversionResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const result = reader.result as string;
        resolve({
          success: true,
          base64: result,
          fileName: file.name,
        });
      } catch (error) {
        resolve({
          success: false,
          error: "Fehler beim Lesen der Datei",
        });
      }
    };

    reader.onerror = () => {
      resolve({
        success: false,
        error: "Fehler beim Lesen der Datei",
      });
    };

    reader.readAsDataURL(file);
  });
}

// Service: Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Service: Check if file is PDF
export function isPDFFile(file: File): boolean {
  return file.type === ALLOWED_MIME_TYPE;
}

// Service: Get file extension
export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}