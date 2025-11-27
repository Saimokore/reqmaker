"use client";

import React, { useState, useId } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

import TabelaCDU from '../components/TabelaCDU';
import BlocoTexto from '../components/BlocoTexto';
import { SortableItem } from '../components/SortableItem';
import { Block, BlockType, CDUData } from './types';
import { generateAndDownloadDocx } from '../app/services/docxGenerator';
import DocxViewer from '../components/DocxViewer'; // <--- Importe o novo componente

// Dados iniciais vazios para um novo CDU
const emptyCDU: CDUData = {
  titulo: "", modulo: "", descricao: "", atores: "",
  preCondicoes: "", fluxoPrincipal: "", fluxosAlternativos: "", 
  fluxosExcecao: "", posCondicoes: ""
};

export default function Home() {
  const dndContextId = useId();
  const [isPreview, setIsPreview] = useState(false); // <--- ESTADO DO MODO

  const handleDownload = () => {
    generateAndDownloadDocx(blocks);
  };

  // O Estado agora guarda TUDO: IDs, Tipos e O CONTEÚDO
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 'b1', type: 'texto', content: 'Introdução ao Sistema' },
    { id: 'b2', type: 'cdu', content: { ...emptyCDU, titulo: 'Login' } },
  ]);

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: `blk-${Date.now()}`,
      type: type,
      // Se for CDU inicia objeto, se for texto inicia string vazia
      content: type === 'cdu' ? { ...emptyCDU } : "" 
    };
    setBlocks([...blocks, newBlock]);
  };

  // Função vital: Atualiza o conteúdo de um bloco específico
  const updateBlockContent = (id: string, newContent: any) => {
    setBlocks(prevBlocks => prevBlocks.map(b => 
      b.id === id ? { ...b, content: newContent } : b
    ));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < blocks.length) {
      setBlocks((items) => arrayMove(items, index, newIndex));
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(b => b.id === active.id);
        const newIndex = items.findIndex(b => b.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // Debug: Função para ver o JSON final (simulando salvar)
  const handleSave = () => {
    console.log("JSON PARA SALVAR NO BANCO:", JSON.stringify(blocks, null, 2));
    alert("Abra o console (F12) para ver o JSON gerado!");
  };

  // COMPONENTE DE RENDERIZAÇÃO DA LISTA (Para não repetir código)
  // Se for preview, apenas renderiza. Se for edit, envelopa no SortableItem
  const renderList = () => {
    return blocks.map((block, index) => {
      
      // Lógica de Contagem CDU
      let cduCounter = 0;
      if (block.type === 'cdu') {
        cduCounter = blocks.slice(0, index + 1).filter(b => b.type === 'cdu').length;
      }

      // Conteúdo do bloco
      const content = (
        <>
          {block.type === 'cdu' && (
            <TabelaCDU 
              indice={cduCounter} 
              data={block.content as CDUData}
              onUpdate={(d) => updateBlockContent(block.id, d)}
              readOnly={isPreview} // Passa o modo
            />
          )}
          {block.type === 'texto' && (
            <BlocoTexto 
              content={block.content as string}
              onUpdate={(t) => updateBlockContent(block.id, t)}
              readOnly={isPreview} // Passa o modo
            />
          )}
        </>
      );

      // SE FOR PREVIEW: Retorna o bloco limpo, sem Drag and Drop
      if (isPreview) {
        return <div key={block.id}>{content}</div>;
      }

      // SE FOR EDIÇÃO: Retorna com SortableItem
      return (
        <SortableItem 
          key={block.id} 
          id={block.id}
          isFirst={index === 0}
          isLast={index === blocks.length - 1}
          onMoveUp={() => moveBlock(index, 'up')}
          onMoveDown={() => moveBlock(index, 'down')}
        >
          {content}
        </SortableItem>
      );
    });
  };

  return (
    <main className={`min-h-screen pb-40 transition-colors ${isPreview ? 'bg-gray-800' : 'bg-gray-50 p-10'}`}>
      
      {/* HEADER FIXO */}
      <div className={`${isPreview ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-800'} sticky top-0 z-20 py-4 border-b shadow-sm px-8 flex justify-between items-center transition-colors`}>
        <h1 className="text-2xl font-bold">
          {isPreview ? 'Visualização de Impressão' : 'Editor de Requisitos'}
        </h1>
        
        <div className="flex gap-2">
           {/* BOTÃO TOGGLE */}
           <button 
            onClick={() => setIsPreview(!isPreview)} 
            className={`px-4 py-2 rounded font-bold border flex items-center gap-2 transition-all
              ${isPreview 
                ? 'bg-white text-black border-white hover:bg-gray-200' 
                : 'bg-gray-800 text-white border-gray-800 hover:bg-gray-700'}`}
          >
            {isPreview ? '✎ Voltar a Editar' : '👁️ Visualizar Impressão'}
          </button>

          {/* Botão Download */}
          <button 
            onClick={handleDownload} 
            className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 flex items-center gap-2"
          >
            <span>📄</span> Baixar DOCX
          </button>

          {/* Botões de Adicionar (Somem no modo preview) */}
          {!isPreview && (
            <>
              <div className="w-px bg-gray-300 mx-2 h-8"></div>
              <button onClick={() => addBlock('texto')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-100">
                + Texto
              </button>
              <button onClick={() => addBlock('cdu')} className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700">
                + Tabela CDU
              </button>
            </>
          )}
        </div>
      </div>

      {/* ÁREA DE CONTEÚDO */}
      <div className={isPreview ? '' : 'max-w-5xl mx-auto mt-8'}>
        
        {isPreview ? (
          // MODO PREVIEW REAL (DOCX)
          <DocxViewer blocks={blocks} />
        ) : (
          // MODO EDIÇÃO (O QUE ESTAVA FALTANDO)
          <DndContext id={dndContextId} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={blocks.map(b => b.id)} strategy={verticalListSortingStrategy}>
              {/* Aqui chamamos a função que desenha a lista de inputs */}
              {renderList()}
            </SortableContext>
          </DndContext>
        )}
        
      </div>
    </main>
  );
}