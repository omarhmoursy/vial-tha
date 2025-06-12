import { randomUUID } from 'crypto'

export const getSeedData = async () => {
  const formData = [
    {
      id: randomUUID(),
      question:
        'Do you have any history of chronic diseases, such as diabetes, hypertension, or cardiovascular diseases?',
      answer: 'No',
    },
    {
      id: randomUUID(),
      question: 'Are you currently taking any prescription medications?',
      answer: 'Yes, antihypertensive medication',
    },
    {
      id: randomUUID(),
      question: 'Have you ever had an allergic reaction to any medications?',
      answer: 'Yes, I am allergic to penicillin.',
    },
    {
      id: randomUUID(),
      question: 'Do you smoke tobacco or use any nicotine products?',
      answer: 'No',
    },
    {
      id: randomUUID(),
      question: 'Do you regularly exercise or engage in physical activity?',
      answer: 'Yes, I walk for 30 minutes every day.',
    },
    {
      id: randomUUID(),
      question: 'Do you have a family history of cancer?',
      answer: 'Yes, my mother had breast cancer.',
    },
    {
      id: randomUUID(),
      question: 'Have you ever been hospitalized for any reason?',
      answer: 'Yes, I was hospitalized for surgery in 2019.',
    },
    {
      id: randomUUID(),
      question: 'Do you have any known food allergies?',
      answer: 'No',
    },
    {
      id: randomUUID(),
      question: 'Do you experience any frequent or chronic headaches?',
      answer: 'No',
    },
    {
      id: randomUUID(),
      question:
        'Do you have any problems with your vision, such as blurred vision or eye strain?',
      answer:
        'Occasionally, I experience eye strain after long periods of screen use.',
    },
  ]

  return {
    formData,
  }
}
