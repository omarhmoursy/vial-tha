/**
 * Displays query status with color-coded badges
 * Red (OPEN) = needs attention, Green (RESOLVED) = completed
 */

import { Badge } from '@mantine/core';
import { IconCheck, IconQuestionMark } from '@tabler/icons-react';
import { QueryStatus } from '@/types';

interface QueryStatusBadgeProps {
  /** The current status of the query to display */
  status: QueryStatus;
}

/**
 * Renders a status badge with appropriate color and icon
 * 
 * Design decisions:
 * - Red for OPEN queries to indicate urgency and required action
 * - Green for RESOLVED queries to indicate completion
 * - Icons provide additional visual clarity beyond just color
 * - Filled variant for better visibility in data-dense tables
 */
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