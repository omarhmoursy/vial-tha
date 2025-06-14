import { useState } from 'react';
import { Modal, Text, Button, Stack, Group, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { api, ApiError } from '@/lib/api';
import { Query, QueryStatus } from '@/types';
import { QueryStatusBadge } from './QueryStatusBadge';

interface ViewQueryModalProps {
  opened: boolean;
  onClose: () => void;
  query: Query;
  onQueryUpdated: (query: Query) => void;
}

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

  const handleResolve = async () => {
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
      const updatedQuery = await api.updateQuery(query.id, {
        status: QueryStatus.RESOLVED,
        description: resolveDescription.trim(),
      });

      notifications.show({
        title: 'Success',
        message: 'Query resolved successfully',
        color: 'green',
      });

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
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>Status</Text>
          <QueryStatusBadge status={query.status} />
        </Group>

        <div>
          <Text size="sm" fw={500} mb={5}>Title</Text>
          <Text size="sm">{query.title}</Text>
        </div>

        <div>
          <Text size="sm" fw={500} mb={5}>Description</Text>
          <Text size="sm" c="dimmed">{query.description}</Text>
        </div>

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

        {!isResolved && (
          <>
            {!showResolveInput ? (
              <Button
                onClick={() => setShowResolveInput(true)}
                color="green"
                fullWidth
              >
                Resolve Query
              </Button>
            ) : (
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