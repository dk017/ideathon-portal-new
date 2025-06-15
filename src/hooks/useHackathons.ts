
import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/services/dataService';

export const useHackathons = () => {
  return useQuery({
    queryKey: ['hackathons'],
    queryFn: dataService.getHackathons,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHackathon = (id: string) => {
  return useQuery({
    queryKey: ['hackathon', id],
    queryFn: () => dataService.getHackathonById(id),
    enabled: !!id,
  });
};
