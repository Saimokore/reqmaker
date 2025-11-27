export interface BlockPlugin {
  type: string;          // ID interno (ex: 'imagem', 'cdu')
  label: string;         // Nome no botão (ex: '+ Imagem')
  buttonColor: string;   // Cor do botão (ex: 'bg-purple-600')
  initialContent: any;   // Dados padrão ao criar
  
  // O Componente React que renderiza na tela
  Component: React.FC<{ 
    data: any; 
    onUpdate: (newData: any) => void; 
    readOnly?: boolean;
    idVisual?: string; // Para passar o "CDU01" se precisar
  }>;

  // A função que transforma os dados em DOCX
  // Retorna um array de nós do docx (Paragraph, Table, etc)
  exporter: (content: any, idVisual?: string) => any[];
}

export interface Block {
  id: string;
  type: string;
  content: any;
}