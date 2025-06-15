/**
 * ViewQueryModal Component
 * 
 * Modal dialog for viewing and resolving existing queries in the clinical trial system.
 * Handles the complete query lifecycle from viewing details to resolution.
 * 
 * Features:
 * - Displays query details (status, title, description, timestamps)
 * - Allows resolving OPEN queries with updated descriptions
 * - Shows resolution history for RESOLVED queries
 * - Prevents modification of already resolved queries
 */

import { useState } from 'react';
import { Modal, Text, Button, Stack, Group, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { api, ApiError } from '@/lib/api';
import { Query, QueryStatus } from '@/types';
import { QueryStatusBadge } from './QueryStatusBadge';

interface ViewQueryModalProps {
  /** Controls modal visibility */
  opened: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** The query to display and potentially modify */
  query: Query;
  /** Callback called when query is successfully updated */
  onQueryUpdated: (query: Query) => void;
}

/**
 * Modal for viewing and resolving queries
 * Shows query details and allows resolution with description
 */
export function ViewQueryModal({ 
  opened, 
  onClose, 
  query, 
  onQueryUpdated 
}: ViewQueryModalProps) {
  const [loading, setLoading] = useState(false);
  const [resolveDescription, setResolveDescription] = useState('');
  const [showResolveInput, setShowResolveInput] = useState(false);

  const isResolved = query.status === QueryStatus.RESOLVED;

  /**
   * Handles query resolution workflow
   * 
   * Business Logic:
   * - Requires resolution description for audit trail
   * - Updates query status to RESOLVED
   * - Preserves resolution description for future reference
   * 
   * This follows clinical trial compliance requirements where
   * all query resolutions must be documented with explanations.
   */
  const handleResolve = async () => {
    // Validation: Ensure resolution description is provided
    if (!resolveDescription.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Please enter a resolution description',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      // Update query with RESOLVED status and new description
      const updatedQuery = await api.updateQuery(query.id, {
        status: QueryStatus.RESOLVED,
        description: resolveDescription.trim(),
      });

      // Success feedback
      notifications.show({
        title: 'Success',
        message: 'Query resolved successfully',
        color: 'green',
      });

      // Update parent component and close modal
      onQueryUpdated(updatedQuery);
      setResolveDescription('');
      setShowResolveInput(false);
      onClose();
    } catch (error) {
      console.error('Error resolving query:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof ApiError ? error.message : 'Failed to resolve query',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Formats ISO date strings for human-readable display
   * Includes both date and time for audit purposes
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Query Details"
      size="md"
    >
      <Stack gap="md">
        {/* Status Section - Visual indicator of current state */}
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>Status</Text>
          <QueryStatusBadge status={query.status} />
        </Group>

        {/* Query Information */}
        <div>
          <Text size="sm" fw={500} mb={5}>Title</Text>
          <Text size="sm">{query.title}</Text>
        </div>

        <div>
          <Text size="sm" fw={500} mb={5}>Description</Text>
          <Text size="sm" c="dimmed">{query.description}</Text>
        </div>

        {/* Audit Trail - Creation and modification timestamps */}
        <Group justify="space-between">
          <div>
            <Text size="xs" c="dimmed">Created</Text>
            <Text size="sm">{formatDate(query.createdAt)}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed">Updated</Text>
            <Text size="sm">{formatDate(query.updatedAt)}</Text>
          </div>
        </Group>

        {/* Resolution Workflow - Only shown for OPEN queries */}
        {!isResolved && (
          <>
            {!showResolveInput ? (
              // Initial resolve button
              <Button
                onClick={() => setShowResolveInput(true)}
                color="green"
                fullWidth
              >
                Resolve Query
              </Button>
            ) : (
              // Resolution form with description input
              <Stack gap="sm">
                <Textarea
                  label="Resolution Description"
                  placeholder="Enter resolution details..."
                  value={resolveDescription}
                  onChange={(event) => setResolveDescription(event.currentTarget.value)}
                  minRows={3}
                  required
                />
                <Group justify="flex-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResolveInput(false);
                      setResolveDescription('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleResolve}
                    loading={loading}
                    color="green"
                  >
                    Confirm Resolution
                  </Button>
                </Group>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
} 