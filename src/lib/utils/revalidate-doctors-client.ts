import { mutate } from "swr";

// 🔄 Realtime (client): the /doctors list uses SWR, whose cache lives outside Next's Router Cache
//    (router.refresh() can't touch it). After a book/cancel, clear every /api/doctors SWR key and
//    revalidate so the freed/taken slot shows instantly. 🧠✨
export const revalidateDoctorsClient = (): Promise<unknown> =>
  mutate(
    (key) => typeof key === "string" && key.startsWith("/api/doctors"),
    undefined,
    { revalidate: true },
  );
