import { useQuery } from "@tanstack/react-query";
import {
  getRoomClosePreview,
  type GetRoomClosePreviewResponse,
} from "@/services/api/rooms/get-room-close-preview";

export const ROOM_CLOSE_PREVIEW_QUERY_KEY = (roomId: string) => ["room-close-preview", roomId];

export const useGetRoomClosePreview = (roomId: string) =>
  useQuery<GetRoomClosePreviewResponse, Error>({
    queryKey: ROOM_CLOSE_PREVIEW_QUERY_KEY(roomId),
    queryFn: () => getRoomClosePreview(roomId),
    enabled: !!roomId,
  });
