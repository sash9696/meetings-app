function joinClasses(...parts) {
  return parts.filter(Boolean).join(' ')
}

export function Card({ className = '', ...props }) {
  return <div className={joinClasses('card', className)} {...props} />
}
