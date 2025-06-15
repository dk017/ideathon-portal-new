
import { useQuery } from '@tanstack/react-query';
import { dataService } from '@/services/dataService';

export const useIdeas = () => {
  return useQuery({
    queryKey: ['ideas'],
    queryFn: dataService.getIdeas,
    staleTime: 3 * 60 * 1000, // 3 minutes
  });
};

export const useIdeasByHackathon = (hackathonId: string) => {
  return useQuery({
    queryKey: ['ideas', 'hackathon', hackathonId],
    queryFn: () => dataService.getIdeasByHackathon(hackathonId),
    enabled: !!hackathonId,
  });
};

export const useUserIdeas = (userId: string) => {
  return useQuery({
    queryKey: ['ideas', 'user', userId],
    queryFn: () => dataService.getUserIdeas(userId),
    enabled: !!userId,
  });
};
