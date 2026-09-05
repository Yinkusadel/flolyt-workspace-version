import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
  getSimilarRooms,
  type GetSimilarRoomsPayload,
  type GetSimilarRoomsResponse,
} from "@/services/api/rooms/get-similar-rooms";

const useGetSimilarRooms = () => {
  const mutation = useMutation<GetSimilarRoomsResponse, Error, GetSimilarRoomsPayload>({
    mutationFn: getSimilarRooms,
    onError: (error) => {
      toast.error(error.message || "Failed to find similar rooms");
    },
  });

  return {
    findSimilarRooms: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    similar: mutation.data?.data ?? null,
    reset: mutation.reset,
  };
};

export default useGetSimilarRooms;
