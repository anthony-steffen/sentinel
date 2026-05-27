import { motion } from "framer-motion"

import { useRealtimeStore } from "../../store/realtime-store"


const statusConfig = {
  CONNECTED: {
    label: "LIVE",
    className:
      "text-success",
    dot: "bg-success",
  },

  CONNECTING: {
    label:
      "RECONNECTING",
    className:
      "text-warning",
    dot: "bg-warning",
  },

  DISCONNECTED: {
    label:
      "OFFLINE",
    className:
      "text-error",
    dot: "bg-error",
  },
}


export function LiveIndicator() {
  const status =
    useRealtimeStore(
      (state) =>
        state.status,
    )

  const config =
    statusConfig[
      status
    ]

  return (
    <div className="flex items-center gap-2">
      <motion.div
        animate={{
          scale: [1, 1.4, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}
        className={`h-3 w-3 rounded-full ${config.dot}`}
      />

      <span
        className={`text-sm font-medium ${config.className}`}
      >
        {config.label}
      </span>
    </div>
  )
}