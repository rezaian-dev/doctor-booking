// 📋 Info row for view mode with proper text truncation
const InfoRow = ({ label, value, icon }: any) => (
  <div className="flex items-start gap-2 min-w-0">
    <span className="text-gray-600 text-sm whitespace-nowrap shrink-0">
      {label}
    </span>
    <div className="flex items-center gap-2 font-medium min-w-0">
      {icon && <span className="text-gray-500 shrink-0">{icon}</span>}
      <span className="text-sm truncate">{value}</span>
    </div>
  </div>
);

export default InfoRow;
