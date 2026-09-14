type ClassValue = string | number | false | null | undefined;

/**
 * Joins class names, dropping falsy values.
 *
 * Deliberately not `clsx` + `tailwind-merge`: with design.md's closed token set
 * there are few enough utilities that conflict resolution is not a problem worth
 * a dependency.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
