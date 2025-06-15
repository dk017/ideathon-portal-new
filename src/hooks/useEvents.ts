import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/services/dataService';

export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: dataService.getEvents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEvent = (id: string) => {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => dataService.getEventById(id),
    enabled: !!id,
  });
};
