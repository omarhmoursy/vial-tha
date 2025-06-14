import { Badge } from '@mantine/core';
import { IconCheck, IconQuestionMark } from '@tabler/icons-react';
import { QueryStatus } from '@/types';

interface QueryStatusBadgeProps {
  status: QueryStatus;
}

export function QueryStatusBadge({ status }: QueryStatusBadgeProps) {
  const isResolved = status === QueryStatus.RESOLVED;
  
  return (
    <Badge
      color={isResolved ? 'green' : 'red'}
      variant="filled"
      leftSection={
        isResolved ? (
          <IconCheck size={12} />
        ) : (
          <IconQuestionMark size={12} />
        )
      }
    >
      {status}
    </Badge>
  );
} 