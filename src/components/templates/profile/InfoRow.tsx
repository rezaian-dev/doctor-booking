// 📋 Info row for view mode
const InfoRow = ({ label, value, icon }: any) => (
  <div className="flex items-center gap-2">
    <span className="text-gray-600 text-sm min-w-fit">{label}</span>
    <div className="flex items-center gap-2 font-medium">
      {icon && <span className="text-gray-500">{icon}</span>}
      <span className="text-sm">{value}</span>
    </div>
  </div>
);

export default InfoRow;
