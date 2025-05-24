"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import {
  BlockNoteView,
  useBlockNote,
  SuggestionMenuController,
  getDefaultSlashMenuItems,
  filterSuggestionItems, // Added for filtering
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import { RiListCheck2 } from "react-icons/ri"; // Added for checklist icon

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const {edgestore} = useEdgeStore()

  const handleUpload = async (file: File) => {
    const response = await edgestore.publicFiles.upload({
        file
    })
    return response.url;
  }

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent
      ? (JSON.parse(initialContent))
      : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile:handleUpload
  });

  // Gets the default slash menu items and adds the custom checkListItem.
  const customGetSlashMenuItems = (
    editor: BlockNoteEditor
  ): typeof defaultSlashMenuItems => {
    const defaultItems = getDefaultSlashMenuItems(editor); // Get default slash items

    const checkListItem = {
      title: "Checklist",
      onItemClick: () => {
        editor.insertBlocks(
          [{ type: "checkListItem", content: "" }],
          editor.getTextCursorPosition().block,
          "after"
        );
      },
      aliases: ["cl", "todo", "checklist"],
      group: "Lists",
      icon: <RiListCheck2 size={18} />,
      hint: "Create a to-do list",
    };

    return [...defaultItems, checkListItem];
  };

  return (
    <div>
      <SuggestionMenuController
        triggerCharacter={"/"}
        getItems={async (query) =>
          // @ts-ignore - Assuming filterSuggestionItems can handle the custom item
          filterSuggestionItems(customGetSlashMenuItems(editor), query)
        }
      >
        <BlockNoteView
          editor={editor}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          slashMenu={false} // Disable default slash menu
        ></BlockNoteView>
      </SuggestionMenuController>
    </div>
  );
};

export default Editor;