"use client";

import React, { ChangeEvent } from 'react';
import { Table, TableRow, TableCell, Paragraph, TextRun, AlignmentType, WidthType, TableLayoutType } from "docx";

interface TabelaCDUProps {
  indice: number;
  data: CDUData; // Recebe o DTO preenchido
  onUpdate: (newData: CDUData) => void; // Função para avisar o pai
  readOnly?: boolean;
}

export default function TabelaCDU({ indice, data, onUpdate, readOnly = false }: TabelaCDUProps) {
  
  // Formatando o ID baseado no índice (ex: 1 vira "CDU01", 10 vira "CDU10")
  const idFormatado = `CDU${indice.toString().padStart(2, '0')}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...data, [name]: value });
  };

  return (
    <div className={`my-4 max-w-4xl mx-auto ${readOnly ? 'preview-mode' : 'shadow-lg bg-white'}`}>
      
      {/* Classe border-collapse faz as bordas ficarem "coladas" igual Excel */}
      <table className="w-full border-collapse border border-gray-400">
        
        {/* --- CABEÇALHO --- */}
        <thead>
          <tr className="bg-gray-100">
            {/* O ID agora é gerado automaticamente, mas visualmente parece um campo */}
            <th className="border border-gray-400 p-2 w-24 text-black">ID</th>
            <th className="border border-gray-400 p-2 text-black">Título</th>
            <th className="border border-gray-400 p-2 w-48 text-black">Módulo</th>
          </tr>
        </thead>

        <tbody>
          {/* --- LINHA 1: Inputs do Cabeçalho --- */}
          <tr>
            <td className="border border-gray-400 p-0">
              <input 
                className="w-full p-2 text-center font-bold text-black outline-none bg-gray-50 cursor-not-allowed"
                value={idFormatado}
                disabled
              />
            </td>
            <td className="border border-gray-400 p-0">
              <input 
                className="w-full p-2 outline-none text-black focus:bg-blue-50"
                name="titulo"
                placeholder="Ex: Manter Usuários"
                value={data.titulo || ""}
                onChange={handleChange}
                disabled={readOnly}
              />
            </td>
            <td className="border border-gray-400 p-0">
              <input 
                className="w-full p-2 text-center font-bold text-black outline-none focus:bg-blue-50"
                name="modulo"
                placeholder="Administrador"
                value={data.modulo || ""}
                onChange={handleChange}
                disabled={readOnly}
              />
            </td>
          </tr>

          {/* --- LINHAS DE CONTEÚDO (Label + TextArea/Input) --- */}
          {/* Função auxiliar para criar linhas padronizadas */}
          <RowTextArea 
            label="Descrição" 
            name="descricao" 
            value={data.descricao || ""}
            onChange={handleChange}
            disabled={readOnly} 
          />
          <RowInput 
            label="Atores" 
            name="atores" 
            value={data.atores || ""}
            onChange={handleChange}
            disabled={readOnly} 
          />
          <RowTextArea
            label="Pré-condições" 
            name="preCondicoes" 
            value={data.preCondicoes || ""}
            onChange={handleChange}
            disabled={readOnly} 
          />
          
          {/* Fluxo Principal e Alternativos */}
          <RowTextArea 
             label="Fluxo Principal" 
             name="fluxoPrincipal" 
             value={data.fluxoPrincipal || ""}
             onChange={handleChange}
             disabled={readOnly} 
             rows={4}
          />
          
           <RowTextArea 
             label="Fluxos Alternativos" 
             name="fluxosAlternativos" 
             value={data.fluxosAlternativos || ""}
             onChange={handleChange}
             disabled={readOnly} 
             rows={3}
          />
          
           <RowTextArea 
             label="Fluxos de Exceção" 
             name="fluxosExcecao" 
             value={data.fluxosExcecao || ""}
             onChange={handleChange}
             disabled={readOnly} 
             rows={2}
          />

          <RowTextArea
            label="Pós-condições" 
            name="posCondicoes" 
            value={data.posCondicoes || ""}
            onChange={handleChange}
            disabled={readOnly} 
          />

        </tbody>
      </table>

      {/* Debug Area */}
      <div className="bg-gray-800 text-white p-1 text-xs font-mono">
        DATA: {idFormatado} - {JSON.stringify(data)}
      </div>

    </div>
  );
}

// --- Componentes Auxiliares para limpar o código ---

function RowInput({ label, name, value, onChange }: any) {
  return (
    <tr>
      <td className="border border-gray-400 p-2 font-bold bg-gray-50 text-black align-middle w-40">
        {label}
      </td>
      <td colSpan={2} className="border border-gray-400 p-0">
        <input 
          className="w-full p-2 outline-none text-black focus:bg-blue-50"
          name={name}
          value={value}
          onChange={onChange}
        />
      </td>
    </tr>
  );
}

function RowTextArea({ label, name, value, onChange, rows }: any) {
  return (
    <tr>
      <td className="border border-gray-400 p-2 font-bold bg-gray-50 text-black align-top w-40 pt-3">
        {label}
      </td>
      <td colSpan={2} className="max-w-1 border border-gray-400 p-0">
        <textarea 
          className="w-full resize-none field-sizing-content max-w-full p-2 outline-none text-black focus:bg-blue-50 block"
          rows={rows}
          name={name}
          value={value}
          onChange={onChange}
        />
      </td>
    </tr>
  );
}

export const exportarTabelaCDU = (data: CDUData, idVisual: string) => {
  
  const fontStyle = "Arial";
  const fontSize = 20; // 10pt
  const grayColor = "F2F2F2";

  const cleanText = (t: string) => (t && t.trim() !== "") ? t : "\u200B";

  // Helper corrigido: Agora o parametro 'align' aceita qualquer tipo de AlignmentType
  const para = (text: string, align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT, bold = false) => 
    new Paragraph({
      alignment: align,
      spacing: { before: 40, after: 40 },
      children: [
        new TextRun({ 
          text: cleanText(text), // <--- AQUI ESTÁ A MÁGICA
          font: fontStyle, 
          size: fontSize, 
          bold: bold 
        })
      ]
    });

  // Helper de Célula também tipado corretamente
  const cell = (
    text: string, 
    bold = false, 
    align: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT, 
    fill = "", 
    colSpan = 1
  ) => 
    new TableCell({
      columnSpan: colSpan,
      shading: fill ? { fill: fill } : undefined,
      verticalAlign: "center",
      children: [para(text, align, bold)],
      margins: {
        top: -10,     // 200 TWIPs = ~0.17cm
        bottom: -10,
        left: 50,
        right: 50,
      },
    });

  const rowMerged = (label: string, value: string) => 
    new TableRow({
      children: [
        // Aqui usamos AlignmentType.CENTER explicitamente
        cell(label, true, AlignmentType.CENTER, grayColor), 
        // Aqui usamos AlignmentType.LEFT explicitamente
        cell(value, false, AlignmentType.LEFT, "", 2)       
      ]
    });

  const col1 = 1800;
  const col2 = 5200;
  const col3 = 2000;

  return new Table({
    layout: TableLayoutType.FIXED,

    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [col1, col2, col3],
    
    rows: [
      // Cabeçalhos
      new TableRow({
        children: [
          cell("ID", true, AlignmentType.CENTER, "FFFFFF"),
          cell("Título", true, AlignmentType.CENTER, "FFFFFF"),
          cell("Módulo", true, AlignmentType.CENTER, "FFFFFF"),
        ],
      }),
      // Valores Principais
      new TableRow({
        children: [
          cell(idVisual, true, AlignmentType.CENTER),
          cell(data.titulo, false, AlignmentType.LEFT),
          cell(data.modulo, true, AlignmentType.CENTER),
        ],
      }),
      // Linhas Detalhadas
      rowMerged("Descrição", data.descricao),
      rowMerged("Atores", data.atores),
      rowMerged("Pré-condições", data.preCondicoes),
      rowMerged("Fluxo Principal", data.fluxoPrincipal),
      rowMerged("Fluxos Alternativos", data.fluxosAlternativos),
      rowMerged("Fluxos de Exceção", data.fluxosExcecao),
      rowMerged("Pós-condições", data.posCondicoes),
    ],
  });
};

export const PluginTexto: BlockPlugin = {
  type: 'string',
  label: '+ Imagem',
  buttonColor: 'bg-purple-600 hover:bg-purple-700 text-white',
  initialContent: { base64: "", legenda: "" },
  Component: ComponenteVisual,
  exporter: exportLogic
};