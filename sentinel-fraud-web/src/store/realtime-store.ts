import { create } from "zustand"


type RealtimeStatus =
  | "CONNECTED"
  | "CONNECTING"
  | "DISCONNECTED"


interface RealtimeState {
  status: RealtimeStatus

  setStatus: (
    status: RealtimeStatus,
  ) => void
}


export const useRealtimeStore =
  create<RealtimeState>(
    (set) => ({
      status:
        "DISCONNECTED",

      setStatus: (
        status,
      ) =>
        set({
          status,
        }),
    }),
  )