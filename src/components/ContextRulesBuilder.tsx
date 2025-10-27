import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { Plus, X } from "lucide-react";
import { OperatorExpression } from "@/lib/types";

interface ContextRulesBuilderProps {
  rules: Record<string, OperatorExpression>;
  onChange: (rules: Record<string, OperatorExpression>) => void;
}

export const ContextRulesBuilder = ({ rules, onChange }: ContextRulesBuilderProps) => {
  const [newField, setNewField] = useState("");

  const operators = [
    { value: "eq", label: "Equals" },
    { value: "neq", label: "Not Equals" },
    { value: "gt", label: "Greater Than" },
    { value: "gte", label: "Greater Than or Equal" },
    { value: "lt", label: "Less Than" },
    { value: "lte", label: "Less Than or Equal" },
    { value: "oneOf", label: "One Of" },
    { value: "notOneOf", label: "Not One Of" },
  ];

  const addRule = () => {
    if (!newField.trim()) return;
    onChange({ ...rules, [newField]: { eq: "" } });
    setNewField("");
  };

  const removeRule = (field: string) => {
    const newRules = { ...rules };
    delete newRules[field];
    onChange(newRules);
  };

  const updateRule = (field: string, operator: string, value: any) => {
    const newRules = { ...rules };
    newRules[field] = { [operator]: value };
    onChange(newRules);
  };

  const getCurrentOperator = (expression: OperatorExpression): string => {
    return Object.keys(expression)[0] || "eq";
  };

  const getCurrentValue = (expression: OperatorExpression): any => {
    const operator = getCurrentOperator(expression);
    return expression[operator as keyof OperatorExpression];
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        All rules must match (AND logic)
      </div>

      {Object.entries(rules).map(([field, expression]) => (
        <Card key={field} className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Field Name</Label>
              <Input value={field} disabled className="font-mono" />
            </div>

            <div className="space-y-2">
              <Label>Operator</Label>
              <Select
                value={getCurrentOperator(expression)}
                onValueChange={(operator) =>
                  updateRule(field, operator, getCurrentValue(expression))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {operators.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Value</Label>
              <div className="flex gap-2">
                {["oneOf", "notOneOf"].includes(getCurrentOperator(expression)) ? (
                  <Input
                    placeholder="value1, value2, value3"
                    value={
                      Array.isArray(getCurrentValue(expression))
                        ? getCurrentValue(expression).join(", ")
                        : ""
                    }
                    onChange={(e) => {
                      const values = e.target.value
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean);
                      updateRule(field, getCurrentOperator(expression), values);
                    }}
                  />
                ) : (
                  <Input
                    placeholder="Value"
                    value={getCurrentValue(expression) ?? ""}
                    onChange={(e) => {
                      let value: string | number = e.target.value;
                      if (["gt", "gte", "lt", "lte"].includes(getCurrentOperator(expression))) {
                        value = parseFloat(value) || 0;
                      }
                      updateRule(field, getCurrentOperator(expression), value);
                    }}
                  />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeRule(field)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}

      <div className="flex gap-2">
        <Input
          placeholder="Field name (e.g., location, accountAge)"
          value={newField}
          onChange={(e) => setNewField(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRule())}
        />
        <Button type="button" onClick={addRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>
    </div>
  );
};
