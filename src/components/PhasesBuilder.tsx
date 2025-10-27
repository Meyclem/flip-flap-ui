import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Plus, X } from "lucide-react";
import { Phase } from "@/lib/types";
import { format } from "date-fns";

interface PhasesBuilderProps {
  phases: Phase[];
  onChange: (phases: Phase[]) => void;
}

export const PhasesBuilder = ({ phases, onChange }: PhasesBuilderProps) => {
  const addPhase = () => {
    const now = new Date().toISOString();
    onChange([...phases, { startDate: now, percentage: 50 }]);
  };

  const removePhase = (index: number) => {
    onChange(phases.filter((_, i) => i !== index));
  };

  const updatePhase = (index: number, updates: Partial<Phase>) => {
    const newPhases = [...phases];
    newPhases[index] = { ...newPhases[index], ...updates };
    onChange(newPhases);
  };

  const formatDateForInput = (date: string) => {
    try {
      return format(new Date(date), "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-4">
      {phases.map((phase, index) => (
        <Card key={index} className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Phase {index + 1}</h4>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removePhase(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Start Date (UTC) *</Label>
                <Input
                  type="datetime-local"
                  value={formatDateForInput(phase.startDate)}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    updatePhase(index, { startDate: date.toISOString() });
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    id={`endDate-${index}`}
                    checked={Boolean(phase.endDate)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const endDate = new Date(phase.startDate);
                        endDate.setDate(endDate.getDate() + 7);
                        updatePhase(index, { endDate: endDate.toISOString() });
                      } else {
                        updatePhase(index, { endDate: undefined });
                      }
                    }}
                  />
                  <Label htmlFor={`endDate-${index}`}>Set End Date</Label>
                </div>
                {phase.endDate && (
                  <Input
                    type="datetime-local"
                    value={formatDateForInput(phase.endDate)}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      updatePhase(index, { endDate: date.toISOString() });
                    }}
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rollout Percentage: {phase.percentage}%</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[phase.percentage]}
                  onValueChange={([value]) => updatePhase(index, { percentage: value })}
                  min={0}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={phase.percentage}
                  onChange={(e) => {
                    const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                    updatePhase(index, { percentage: value });
                  }}
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Button type="button" onClick={addPhase} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Phase
      </Button>

      {phases.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Phases will be evaluated in order. Make sure dates don't overlap.
        </div>
      )}
    </div>
  );
};
