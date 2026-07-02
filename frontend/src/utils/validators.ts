export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2;
}

export function validateAbout(about: string): boolean {
  return about.length <= 200;
}
