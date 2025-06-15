/**
 * Main table view for Clinical Trial Query Management
 * Displays form data with query status and actions to create/view queries
 */

'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Text, Container, Title, Alert, Loader, Center } from '@mantine/core';
import { IconAlertCircle, IconPlus, IconEye } from '@tabler/icons-react';
import { api, ApiError } from '@/lib/api';
import { FormData, Query } from '@/types';
import { QueryStatusBadge } from './QueryStatusBadge';
import { CreateQueryModal } from './CreateQueryModal';
import { ViewQueryModal } from './ViewQueryModal';

export function DataTable() {
  // Data state
  const [formData, setFormData] = useState<FormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedFormData, setSelectedFormData] = useState<FormData | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const data = await api.getFormData();
      setFormData(data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof ApiError ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update local state when query is created/updated
  const handleQueryCreated = (newQuery: Query) => {
    setFormData(prevData =>
      prevData.map(item =>
        item.id === newQuery.formDataId
          ? { ...item, query: newQuery }
          : item
      )
    );
  };

  const handleQueryUpdated = (updatedQuery: Query) => {
    setFormData(prevData =>
      prevData.map(item =>
        item.query?.id === updatedQuery.id
          ? { ...item, query: updatedQuery }
          : item
      )
    );
  };

  const openCreateModal = (formDataItem: FormData) => {
    setSelectedFormData(formDataItem);
    setCreateModalOpen(true);
  };

  const openViewModal = (query: Query) => {
    setSelectedQuery(query);
    setViewModalOpen(true);
  };

  if (loading) {
    return (
      <Center h={400}>
        <div style={{ textAlign: 'center' }}>
          <Loader size="lg" />
          <Text mt="md" c="dimmed">Loading data...</Text>
        </div>
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="md" mt="xl">
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error" 
          color="red"
          variant="filled"
        >
          {error}
          <Button 
            variant="outline" 
            size="xs" 
            mt="sm"
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
          >
            Retry
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" mt="xl">
      <Title order={1} mb="xl" ta="center">
        Clinical Trial Query Management
      </Title>

      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Question</Table.Th>
            <Table.Th>Answer</Table.Th>
            <Table.Th>Query Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {formData.map((item) => (
            <Table.Tr key={item.id}>
              <Table.Td style={{ maxWidth: '300px' }}>
                <Text size="sm">{item.question}</Text>
              </Table.Td>
              <Table.Td style={{ maxWidth: '200px' }}>
                <Text size="sm" truncate>{item.answer}</Text>
              </Table.Td>
              <Table.Td>
                {item.query ? (
                  <QueryStatusBadge status={item.query.status} />
                ) : (
                  <Text size="sm" c="dimmed">No Query</Text>
                )}
              </Table.Td>
              <Table.Td>
                {item.query ? (
                  <Button
                    size="xs"
                    variant="outline"
                    leftSection={<IconEye size={14} />}
                    onClick={() => openViewModal(item.query!)}
                  >
                    View Query
                  </Button>
                ) : (
                  <Button
                    size="xs"
                    leftSection={<IconPlus size={14} />}
                    onClick={() => openCreateModal(item)}
                  >
                    Create Query
                  </Button>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* Modals */}
      {selectedFormData && (
        <CreateQueryModal
          opened={createModalOpen}
          onClose={() => {
            setCreateModalOpen(false);
            setSelectedFormData(null);
          }}
          formData={selectedFormData}
          onQueryCreated={handleQueryCreated}
        />
      )}

      {selectedQuery && (
        <ViewQueryModal
          opened={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedQuery(null);
          }}
          query={selectedQuery}
          onQueryUpdated={handleQueryUpdated}
        />
      )}
    </Container>
  );
} 