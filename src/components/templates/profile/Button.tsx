// 🎨 Reusable button component
 const Button  = ({ children, onClick, disabled, variant = 'default', className = '' }: any) => {
  const styles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-300 hover:bg-gray-100'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant as keyof typeof styles]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
