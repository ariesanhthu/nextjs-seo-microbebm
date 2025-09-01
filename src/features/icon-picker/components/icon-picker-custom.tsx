"use client";
import { IconPicker, Icon, type IconName } from "@/components/ui/icon-picker";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface IconFieldProps {
  value?: string;
  onChange?: (iconName: string | undefined) => void;
  placeholder?: string;
  showPicker?: boolean;
  showPreview?: boolean;
  iconSize?: string;
  iconColor?: string;
  className?: string;
  label?: string;
  disabled?: boolean;
}

export default function IconField({
  value = "",
  onChange,
  placeholder = "Chọn icon",
  showPicker = true,
  showPreview = true,
  iconSize = "w-8 h-8",
  iconColor = "text-green-600",
  className = "",
  label,
  disabled = false
}: IconFieldProps) {
  const [iconName, setIconName] = useState<IconName | undefined>(value as IconName);

  useEffect(() => {
    setIconName(value as IconName);
  }, [value]);

  const handleIconChange = (newIconName: IconName) => {
    setIconName(newIconName);
    onChange?.(newIconName);
  };

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium mb-2 block">{label}</label>
      )}
      
      {showPicker && (
        <IconPicker
          value={iconName}
          onValueChange={handleIconChange}
          triggerPlaceholder={placeholder}
          disabled={disabled}
          searchPlaceholder="Tìm kiếm icon..."
        >
          <Button variant="outline" className="h-10 w-10 p-0">
            {iconName ? (
              <Icon name={iconName} className="h-4 w-4" />
            ) : (
              <span className="text-xs">Icon</span>
            )}
          </Button>
        </IconPicker>
      )}
      
      {/* {showPreview && iconName && (
        <div className="mt-2 flex items-center gap-2">
          <Icon name={iconName} className={`${iconSize} ${iconColor}`} aria-hidden="true" />
          {showPicker && (
            <span className="text-sm text-gray-600">Icon đã chọn: {iconName}</span>
          )}
        </div>
      )} */}
    </div>
  );
}
