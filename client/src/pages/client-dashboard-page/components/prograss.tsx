"use client";

import { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type Task = {
  id: string;
  name: string;
  category: "Fitness" | "Wellness" | "Nutrition";
  completed: boolean;
  assignedByCoach: boolean;
};

interface InProgressTabProps {
  tasks: Task[];
  isCoach: boolean;
}

export function InProgressTab({ tasks, isCoach }: InProgressTabProps) {
  const [taskList, setTaskList] = useState<Task[]>(tasks);

  const toggleTask = (task: Task) => {
    // Fitness tasks can only be toggled by coach
    if (task.category === "Fitness" && !isCoach) return;

    setTaskList((prev) =>
      prev.map((t) =>
        t.id === task.id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Check if all tasks are completed
  const allCompleted = useMemo(
    () => taskList.every((t) => t.completed),
    [taskList]
  );

  return (
    <div className="space-y-4">
      {taskList.map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={() => toggleTask(task)}
              disabled={task.category === "Fitness" && !isCoach}
            />
            <span className="font-medium">{task.name}</span>
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                task.category === "Fitness"
                  ? "bg-green-200 text-green-800"
                  : task.category === "Wellness"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-blue-200 text-blue-800"
              }`}
            >
              {task.category}
            </span>
            {task.assignedByCoach && (
              <span className="text-xs text-gray-500 ml-2">(Assigned by Coach)</span>
            )}
          </div>
        </div>
      ))}

      {/* Badge Button appears only when all tasks are completed */}
      <div className="text-center mt-4">
        <Button disabled={!allCompleted}>
          {allCompleted ? "Claim Badge 🎉" : "Complete all tasks to earn badge"}
        </Button>
      </div>
    </div>
  );
}
