import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";
import { Block } from "../types";
import { getPlugin } from "../registry"; // <--- Importa o registro

const createDocxDocument = (blocks: Block[]) => {
  const docChildren: any[] = [];
  let cduCounter = 0; // Ainda mantemos contador global se algum plugin precisar

  // Título Fixo
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: "Especificação", font: "Arial", bold: true, size: 32 })]
    })
  );

  blocks.forEach((block) => {
    // 1. Busca o Plugin responsável por esse tipo de bloco
    const plugin = getPlugin(block.type);

    if (plugin) {
      // Lógica específica para contadores (se o plugin for do tipo CDU)
      // Podemos melhorar isso no futuro colocando uma flag 'usesCounter' no plugin
      let idVisual = "";
      if (block.type === 'cdu') { // Único hardcode tolerável ou movível para config
        cduCounter++;
        idVisual = `CDU${cduCounter.toString().padStart(2, '0')}`;
      }

      // 2. O GERADOR DELEGA TUDO PARA O PLUGIN
      // "Plugin, aqui estão seus dados. Me dê os nós do Word."
      const nodes = plugin.exporter(block.content, idVisual);
      
      // Adiciona o resultado ao documento
      if (Array.isArray(nodes)) {
        docChildren.push(...nodes);
      } else {
        docChildren.push(nodes);
      }
    }
  });

  return new Document({ sections: [{ children: docChildren }] });
};

export const generateAndDownloadDocx = async (blocks: Block[]) => {
  const doc = createDocxDocument(blocks);
  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Requisitos.docx");
};

// 1. Função para pegar o BLOB (usada pelo visualizador)
export const generateDocxBlob = async (blocks: Block[]): Promise<Blob> => {
  const doc = createDocxDocument(blocks);
  return await Packer.toBlob(doc);
};

// 2. Mantemos a função antiga para o botão de download
export const generateAndDownloadDocx = async (blocks: Block[]) => {
  const blob = await generateDocxBlob(blocks);
  saveAs(blob, "Requisitos.docx");
};