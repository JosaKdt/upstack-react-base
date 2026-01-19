export function generateMatricule(promotionCode: string, studentNumber: number) {
  const year = new Date().getFullYear()
  return `${year}-${promotionCode}-${String(studentNumber).padStart(5, '0')}`
}
