// 🩺 Admin doctor list query + UI helpers — extracted from (dashboard)/admin/doctors/page.tsx
import { connectDB } from "@/lib/db/connection";
import { Doctor } from "@/lib/db/models/doctor";

export type DoctorItem = {
  _id: string;
  name: string;
  specialty: string;
  city: string;
  medicalCode: string;
  visitFee: number;
  hasOnlineVisit: boolean;
  hasInPersonVisit: boolean;
  photo: string;
};

const PAGE_SIZE = 10;

export async function getAdminDoctors(page: number, search: string) {
  await connectDB();

  const query: Record<string, unknown> = search
    ? {
        $or: [
          { name:      { $regex: search, $options: "i" } },
          { specialty: { $regex: search, $options: "i" } },
          { city:      { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [raw, total] = await Promise.all([
    Doctor.find(query)
      .select("name specialty city medicalCode visitFee hasOnlineVisit hasInPersonVisit photo")
      .sort({ createdAt: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean<{
        _id: unknown;
        name: string;
        specialty: string;
        city: string;
        medicalCode: string;
        visitFee: number;
        hasOnlineVisit: boolean;
        hasInPersonVisit: boolean;
        photo?: string;
      }[]>(),
    Doctor.countDocuments(query),
  ]);

  return {
    doctors: raw.map((d) => ({
      _id:             String(d._id),
      name:            d.name,
      specialty:       d.specialty,
      city:            d.city,
      medicalCode:     d.medicalCode,
      visitFee:        d.visitFee,
      hasOnlineVisit:  d.hasOnlineVisit,
      hasInPersonVisit: d.hasInPersonVisit,
      photo:           d.photo ?? "",
    })) as DoctorItem[],
    total,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

// ✏️ Serialized doctor shape consumed by <DoctorForm initialData>
export type DoctorEditData = {
  _id: string;
  name: string;
  specialty: string;
  experience: number;
  about: string;
  medicalCode: string;
  address: string;
  city: string;
  gender: string;
  photo: string;
  visitFee: number;
  hasOnlineVisit: boolean;
  hasInPersonVisit: boolean;
  acceptedInsurances: string[];
  contact: { phone: string; website: string; instagram: string };
  schedule: { date: string; times: string[] }[];
};

// 🔍 Single doctor for the edit page — lean() + full ObjectId serialization. null ⇒ 404.
export async function getDoctorForEdit(id: string): Promise<DoctorEditData | null> {
  await connectDB();

  const raw = await Doctor.findById(id).lean<{
    _id: unknown;
    name: string;
    specialty: string;
    experience: number;
    about?: string;
    medicalCode: string;
    address: string;
    city: string;
    gender: string;
    photo?: string;
    visitFee: number;
    hasOnlineVisit: boolean;
    hasInPersonVisit: boolean;
    acceptedInsurances?: string[];
    contact?: { phone?: string; website?: string; instagram?: string };
    schedule?: { date: string; times: string[] }[];
  }>();

  if (!raw) return null;

  return {
    _id:                String(raw._id),
    name:               raw.name,
    specialty:          raw.specialty,
    experience:         raw.experience,
    about:              raw.about ?? "",
    medicalCode:        raw.medicalCode,
    address:            raw.address,
    city:               raw.city,
    gender:             raw.gender,
    photo:              raw.photo ?? "",
    visitFee:           raw.visitFee,
    hasOnlineVisit:     raw.hasOnlineVisit,
    hasInPersonVisit:   raw.hasInPersonVisit,
    acceptedInsurances: raw.acceptedInsurances ?? [],
    contact: {
      phone:     raw.contact?.phone     ?? "",
      website:   raw.contact?.website   ?? "",
      instagram: raw.contact?.instagram ?? "",
    },
    // 🗑️ Strip _id from schedule subdocuments → keep only { date, times }
    schedule: (raw.schedule ?? []).map(({ date, times }) => ({ date, times })),
  };
}
