// 🏷️ Single filter option (e.g., checkbox or select item)
export interface FilterOption {
  id: string;     // 🔑 Unique value (e.g., "cardiology")
  label: string;  // 📄 Display text (e.g., "Cardiology")
}

// ⚙️ Configuration for a filter group (used in UI rendering)
export interface FilterConfig {
  id: keyof FilterFormData; // 🔗 Matches a field in FilterFormData
  title: string;            // 🧾 Section heading (e.g., "Specialties")
  label: string;            // 📌 Field label (e.g., "Select specialty")
  options: FilterOption[];  // 📋 Available choices
}

// 📝 Form data structure for all active filters
export interface FilterFormData {
  search: string;           // 🔍 Free-text query
  specialties: string[];    // 🩺 Selected specialty IDs
  insurances: string[];     // 🛡️ Accepted insurance IDs
  experience: string[];     // 📅 Years of experience range(s)
  availability: string[];   // 📅 Time/day availability IDs
  city: string[];           // 🏙️ Selected city IDs
  gender: string;           // 🚻 "" | "male" | "female" — single choice (matches runtime FilterState)
}
