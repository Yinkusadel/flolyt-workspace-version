import { useQuery } from "@tanstack/react-query";
import { getChurnPrediction, type GetChurnPredictionResponse } from "@/services/api/lifecycle/get-churn-prediction";

export const CHURN_PREDICTION_QUERY_KEY = ["lifecycle-churn-prediction"];

export const useGetChurnPrediction = () =>
  useQuery<GetChurnPredictionResponse, Error>({
    queryKey: CHURN_PREDICTION_QUERY_KEY,
    queryFn: getChurnPrediction,
  });
