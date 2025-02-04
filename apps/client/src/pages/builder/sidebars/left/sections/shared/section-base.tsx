/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable prettier/prettier */
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import { SectionItem, SectionKey, SectionWithItem } from "@reactive-resume/schema";
import { Button } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import get from "lodash.get";
import { useSearchParams } from "react-router-dom";

import { useDialog } from "@/client/stores/dialog";
import { usePortfolioStore } from "@/client/stores/portfolio";
import { useResumeStore } from "@/client/stores/resume";

import { getSectionIcon } from "./section-icon";
import { SectionListItem } from "./section-list-item";
import { SectionOptions } from "./section-options";

type Props<T extends SectionItem> = {
  id: SectionKey;
  title: (item: T) => string;
  description?: (item: T) => string | undefined;
};

export const SectionBase = <T extends SectionItem>({ id, title, description }: Props<T>) => {
  const { open } = useDialog(id);
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "resume";

  // Use appropriate store based on mode
  const setValue = mode === "portfolio"
    ? usePortfolioStore((state) => state.setValue)
    : useResumeStore((state) => state.setValue);

  const section = mode === "portfolio"
    ? usePortfolioStore((state) => get(state.portfolio?.data?.sections, id)) as unknown as SectionWithItem<T>
    : useResumeStore((state) => get(state.resume?.data?.sections, id)) as SectionWithItem<T>;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );


  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!section) return null;

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = section.items.findIndex((item) => item.id === active.id);
      const newIndex = section.items.findIndex((item) => item.id === over.id);

      const sortedList = arrayMove(section.items as T[], oldIndex, newIndex);
      setValue(`sections.${id}.items`, sortedList);
    }
  };

  const onCreate = () => {
    open("create", { id });
  };
  const onUpdate = (item: T) => {
    open("update", { id, item });
  };
  const onDuplicate = (item: T) => {
    open("duplicate", { id, item });
  };
  const onDelete = (item: T) => {
    open("delete", { id, item });
  };

  const onToggleVisibility = (index: number) => {
    const visible = get(section, `items[${index}].visible`, true);
    setValue(`sections.${id}.items[${index}].visible`, !visible);
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-y-6"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon(id)}

          <h2 className="line-clamp-1 text-3xl font-bold">{section.name}</h2>
        </div>

        <div className="flex items-center gap-x-2">
          <SectionOptions id={id} />
        </div>
      </header>

      <main className={cn("grid transition-opacity", !section.visible && "opacity-50")}>
        {section.items.length === 0 && (
          <Button
            variant="outline"
            className="gap-x-2 border-dashed py-6 leading-relaxed hover:bg-secondary-accent"
            onClick={onCreate}
          >
            <Plus size={14} />
            <span className="font-medium">
              {t({
                message: "Add a new item",
                context: "For example, add a new work experience, or add a new profile.",
              })}
            </span>
          </Button>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToParentElement]}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={section.items} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {section.items.map((item, index) => (
                <SectionListItem
                  key={item.id}
                  id={item.id}
                  visible={item.visible}
                  title={title(item as T)}
                  description={description?.(item as T)}
                  onUpdate={() => {
                    onUpdate(item as T);
                  }}
                  onDelete={() => {
                    onDelete(item as T);
                  }}
                  onDuplicate={() => {
                    onDuplicate(item as T);
                  }}
                  onToggleVisibility={() => {
                    onToggleVisibility(index);
                  }}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      </main>

      {section.items.length > 0 && (
        <footer className="flex items-center justify-end">
          <Button variant="outline" className="ml-auto gap-x-2" onClick={onCreate}>
            <Plus />
            <span>
              {t({
                message: "Add a new item",
                context: "For example, add a new work experience, or add a new profile.",
              })}
            </span>
          </Button>
        </footer>
      )}
    </motion.section>
  );
};
