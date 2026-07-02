import { describe, it, expect } from 'vitest';
import { validateAbout, validateEmail, validateName } from '../utils/validators';

describe('validateEmail', () => {
  it('accepts a well-formed email', () => {
    expect(validateEmail('jane@example.com')).toBe(true);
  });
  it('rejects a missing @', () => {
    expect(validateEmail('jane.example.com')).toBe(false);
  });
  it('rejects a missing domain', () => {
    expect(validateEmail('jane@')).toBe(false);
  });
});

describe('validateName', () => {
  it('accepts names of 2+ chars', () => {
    expect(validateName('Jo')).toBe(true);
  });
  it('rejects single-char names', () => {
    expect(validateName('J')).toBe(false);
  });
  it('rejects whitespace-only names', () => {
    expect(validateName('  ')).toBe(false);
  });
});

describe('validateAbout', () => {
  it('accepts empty string', () => {
    expect(validateAbout('')).toBe(true);
  });
  it('accepts exactly 200 chars', () => {
    expect(validateAbout('a'.repeat(200))).toBe(true);
  });
  it('rejects 201 chars', () => {
    expect(validateAbout('a'.repeat(201))).toBe(false);
  });
});
