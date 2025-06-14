import { useState } from 'react';
import { Modal, TextInput, Textarea, Button, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { api, ApiError } from '@/lib/api';
import { FormData, Query } from '@/types';

interface CreateQueryModalProps {
  opened: boolean;
  onClose: () => void;
  formData: FormData;
  onQueryCreated: (query: Query) => void;
}

export function CreateQueryModal({ 
  opened, 
  onClose, 
  formData, 
  onQueryCreated 
}: CreateQueryModalProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim()) {
      notifications.show({
        title: 'Error',
        message: 'Please enter a description',
        color: 'red',
      });
      return;
    }

    setLoading(true);
    try {
      const query = await api.createQuery({
        title: formData.question,
        description: description.trim(),
        formDataId: formData.id,
      });

      notifications.show({
        title: 'Success',
        message: 'Query created successfully',
        color: 'green',
      });

      onQueryCreated(query);
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Error creating query:', error);
      notifications.show({
        title: 'Error',
        message: error instanceof ApiError ? error.message : 'Failed to create query',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="Create Query"
      size="md"
    >
      <Stack gap="md">
        <div>
          <Text size="sm" fw={500} mb={5}>Question</Text>
          <Text size="sm" c="dimmed">{formData.question}</Text>
        </div>
        
        <div>
          <Text size="sm" fw={500} mb={5}>Answer</Text>
          <Text size="sm" c="dimmed">{formData.answer}</Text>
        </div>

        <TextInput
          label="Title"
          value={formData.question}
          disabled
          description="Title is automatically set to the question"
        />

        <Textarea
          label="Description"
          placeholder="Enter query description..."
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          minRows={3}
          required
        />

        <Button
          onClick={handleSubmit}
          loading={loading}
          fullWidth
        >
          Create Query
        </Button>
      </Stack>
    </Modal>
  );
} 