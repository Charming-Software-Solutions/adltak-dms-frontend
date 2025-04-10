"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Project } from "@/types/project";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";

type ProductTransferComboBoxProps = {
  projects: Project[];
  onTransfer: (project: Project | null) => void;
};

const ProductTransferComboBox = ({
  projects,
  onTransfer,
}: ProductTransferComboBoxProps) => {
  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const selectedProjectName = projects.find(
    (project) => project.id === selectedProject?.id,
  )?.name;

  const handleSelectProject = (projectName: string) => {
    const project = projects.find((p) => p.name === projectName) || null;
    setSelectedProject((prevSelected) =>
      prevSelected?.id === project?.id ? null : project,
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[11rem] justify-between"
        >
          {selectedProjectName || "Select project..."}{" "}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search project..." />
          <CommandList className="h-auto">
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup className="w-full">
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={project.name}
                  onSelect={(currentValue: string) => {
                    handleSelectProject(currentValue);
                  }}
                >
                  {project.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedProject?.id === project.id
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          {selectedProject && (
            <React.Fragment>
              <Separator />
              <CommandGroup>
                <CommandItem
                  className="p-2"
                  onSelect={() => {
                    onTransfer(selectedProject);
                    setOpen(false);
                  }}
                >
                  Allocate Product
                </CommandItem>
              </CommandGroup>
            </React.Fragment>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ProductTransferComboBox;
