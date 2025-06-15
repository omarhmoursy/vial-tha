/**
 * CreateQueryModal Component
 * 
 * Modal dialog for creating new queries in the clinical trial data management system.
 * This component handles the workflow when data managers identify issues that need review.
 * 
 * Business Logic:
 * - Title is auto-populated from the FormData question (as per requirements)
 * - Description is user-provided to explain what needs review
 * - Backend prevents duplicate queries per FormData record
 * - Form validation ensures required fields are filled
 * - Real-time UI updates on successful creation
 */

import { useState } from 'react';
import { Modal, TextInput, Textarea, Button, Stack, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { api, ApiError } from '@/lib/api';
import { FormData, Query } from '@/types';

interface CreateQueryModalProps {
  /** Controls modal visibility */
  opened: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** The FormData record that needs a query */
  formData: FormData;
  /** Callback called when query is successfully created */
  onQueryCreated: (query: Query) => void;
}

/**
 * Modal for creating new queries
 * Auto-populates title from question, requires description
 */
export function CreateQueryModal({ 
  opened, 
  onClose, 
  formData, 
  onQueryCreated 
}: CreateQueryModalProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Handles form submission and query creation
   * 
   * Validation:
   * - Ensures description is not empty or whitespace-only
   * - Trims whitespace to prevent unnecessary spacing
   * 
   * Error Handling:
   * - Catches API errors and displays user-friendly messages
   * - Distinguishes between validation errors and server errors
   */
  const handleSubmit = async () => {
    // Client-side validation
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
      // Create query with auto-populated title from question
      const query = await api.createQuery({
        title: formData.question,
        description: description.trim(),
        formDataId: formData.id,
      });

      // Success feedback
      notifications.show({
        title: 'Success',
        message: 'Query created successfully',
        color: 'green',
      });

      // Update parent component and close modal
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

  /**
   * Handles modal closure with cleanup
   * Resets form state to prevent stale data on next open
   */
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
        {/* Context Information - Shows what data is being queried */}
        <div>
          <Text size="sm" fw={500} mb={5}>Question</Text>
          <Text size="sm" c="dimmed">{formData.question}</Text>
        </div>
        
        <div>
          <Text size="sm" fw={500} mb={5}>Answer</Text>
          <Text size="sm" c="dimmed">{formData.answer}</Text>
        </div>

        {/* Auto-populated title field (read-only as per requirements) */}
        <TextInput
          label="Title"
          value={formData.question}
          disabled
          description="Title is automatically set to the question"
        />

        {/* User input for query description */}
        <Textarea
          label="Description"
          placeholder="Enter query description..."
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          minRows={3}
          required
        />

        {/* Submit button with loading state */}
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