// components/BlocoTexto.tsx
"use client";
import React from 'react';
import { Paragraph, TextRun, AlignmentType } from "docx";

interface BlocoTextoProps {
  content: string;
  onUpdate: (newText: string) => void;
  readOnly?: boolean; // <--- NOVA PROP
}

export default function BlocoTexto({ content, onUpdate, readOnly = false }: BlocoTextoProps) {
  return (
    <div className={`my-2 max-w-4xl mx-auto ${readOnly ? 'preview-mode px-0' : 'bg-white group hover:shadow-md px-4'}`}>
      <textarea
        className="w-full text-gray-700 outline-none resize-none field-sizing-content min-h-[24px] bg-transparent"
        placeholder={readOnly ? "" : "Digite texto..."}
        value={content}
        onChange={(e) => onUpdate(e.target.value)}
        disabled={readOnly} // Desativa edição
      />
    </div>
  );
}

export const exportarBlocoTexto = (content: string) => {
  return new Paragraph({
    children: [
      new TextRun({ 
        text: content || "", 
        font: "Arial", // <--- Importante
        size: 22 // 11pt
      })
    ],
    alignment: AlignmentType.JUSTIFIED, // Texto justificado fica mais bonito
    spacing: { after: 200 }
  });
};