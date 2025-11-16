import validator from 'validator'

export interface ValidationError {
  field: string
  message: string
}

export const validateEmail = (email: string): ValidationError | null => {
  if (!email || email.trim() === '') {
    return { field: 'email', message: 'Email wajib diisi' }
  }

  if (!validator.isEmail(email)) {
    return { field: 'email', message: 'Format email tidak valid' }
  }

  return null
}

export const validatePassword = (password: string): ValidationError | null => {
  if (!password || password.trim() === '') {
    return { field: 'password', message: 'Password wajib diisi' }
  }

  if (password.length < 6) {
    return { field: 'password', message: 'Password minimal 6 karakter' }
  }

  if (password.length > 100) {
    return { field: 'password', message: 'Password maksimal 100 karakter' }
  }

  // Optional: Cek kekuatan password
  if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 0,
      minUppercase: 0,
      minNumbers: 0,
      minSymbols: 0,
    })
  ) {
    return { field: 'password', message: 'Password terlalu lemah' }
  }

  return null
}

export const validateName = (nama: string): ValidationError | null => {
  if (!nama || nama.trim() === '') {
    return { field: 'nama', message: 'Nama wajib diisi' }
  }

  // Sanitize: hapus tag HTML
  const sanitized = validator.escape(nama.trim())

  if (sanitized.length < 3) {
    return { field: 'nama', message: 'Nama minimal 3 karakter' }
  }

  if (sanitized.length > 100) {
    return { field: 'nama', message: 'Nama maksimal 100 karakter' }
  }

  // Cek hanya huruf dan spasi
  if (!validator.isAlpha(sanitized.replace(/\s/g, ''), 'en-US')) {
    return { field: 'nama', message: 'Nama hanya boleh berisi huruf dan spasi' }
  }

  return null
}

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): ValidationError | null => {
  if (password !== confirmPassword) {
    return { field: 'passwordConfirm', message: 'Password tidak sama' }
  }
  return null
}
