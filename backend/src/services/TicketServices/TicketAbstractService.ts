const TicketAbstractService = (_ticketId: string) => {
  return [
    {
      question: 'Qual serviço deseja?',
      answer: 'Orçamento'
    },
    {
      question: 'O que deseja?',
      answer: 'Modificar Orçamento'
    },
    {
      question: 'Informe a Descrição',
      answer: 'Descrição de Alteração'
    }
  ]
};

export default TicketAbstractService;