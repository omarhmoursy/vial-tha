'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  Container, 
  Title, 
  Text, 
  ActionIcon, 
  Tooltip, 
  Loader,
  Alert,
  Stack
} from '@mantine/core';
import { IconPlus, IconAlertCircle } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { api, ApiError } from '@/lib/api';
import { FormData, Query } from '@/types';
import { QueryStatusBadge } from './QueryStatusBadge';
import { CreateQueryModal } from './CreateQueryModal';
import { ViewQueryModal } from './ViewQueryModal';

export function DataTable() {
  const [formData, setFormData] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [viewModalOpened, setViewModalOpened] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState<FormData | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getFormData();
      setFormData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch data';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateQuery = (item: FormData) => {
    setSelectedFormData(item);
    setCreateModalOpened(true);
  };

  const handleViewQuery = (query: Query) => {
    setSelectedQuery(query);
    setViewModalOpened(true);
  };

  const handleQueryCreated = (query: Query) => {
    // Update the form data with the new query
    setFormData(prev => prev.map(item => 
      item.id === query.formDataId 
        ? { ...item, query }
        : item
    ));
  };

  const handleQueryUpdated = (updatedQuery: Query) => {
    // Update the form data with the updated query
    setFormData(prev => prev.map(item => 
      item.id === updatedQuery.formDataId 
        ? { ...item, query: updatedQuery }
        : item
    ));
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text>Loading data...</Text>
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="lg">
        <div>
          <Title order={1} mb="xs">Query Management Application</Title>
          <Text c="dimmed">
            Manage clinical trial data queries. Create queries for data that needs review, 
            and resolve them once verified.
          </Text>
        </div>

        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Question</Table.Th>
              <Table.Th>Answer</Table.Th>
              <Table.Th>Query</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {formData.map((item) => (
              <Table.Tr key={item.id}>
                <Table.Td style={{ maxWidth: '400px' }}>
                  <Text size="sm">{item.question}</Text>
                </Table.Td>
                <Table.Td style={{ maxWidth: '200px' }}>
                  <Text size="sm">{item.answer}</Text>
                </Table.Td>
                <Table.Td>
                  {item.query ? (
                    <div 
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleViewQuery(item.query!)}
                    >
                      <QueryStatusBadge status={item.query.status} />
                    </div>
                  ) : (
                    <Tooltip label="Create Query">
                      <ActionIcon
                        variant="light"
                        color="blue"
                        onClick={() => handleCreateQuery(item)}
                      >
                        <IconPlus size={16} />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {formData.length === 0 && (
          <Text ta="center" c="dimmed" py="xl">
            No data available
          </Text>
        )}
      </Stack>

      {/* Modals */}
      {selectedFormData && (
        <CreateQueryModal
          opened={createModalOpened}
          onClose={() => {
            setCreateModalOpened(false);
            setSelectedFormData(null);
          }}
          formData={selectedFormData}
          onQueryCreated={handleQueryCreated}
        />
      )}

      {selectedQuery && (
        <ViewQueryModal
          opened={viewModalOpened}
          onClose={() => {
            setViewModalOpened(false);
            setSelectedQuery(null);
          }}
          query={selectedQuery}
          onQueryUpdated={handleQueryUpdated}
        />
      )}
    </Container>
  );
} 