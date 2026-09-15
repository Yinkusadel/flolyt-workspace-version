import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { exportRoomLog } from "@/services/api/rooms/export-room-log";

const useExportRoomLog = () => {
  const mutation = useMutation<Blob, Error, string>({
    mutationFn: exportRoomLog,
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "room-log.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to export the room's log");
    },
  });

  return {
    download: mutation.mutate,
    isPending: mutation.isPending,
  };
};

export default useExportRoomLog;
