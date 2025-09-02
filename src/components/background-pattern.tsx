import { useId } from "react";

// Background Pattern

type PatternType = "leaf" | "dots" | "grid" | "diagonal" | "waves";

type BackgroundPatternProps = {
  type?: PatternType;
  color?: string;
  opacity?: number; // 0..1
  rotation?: number; // degrees
  strokeWidth?: number;
  spacing?: number; // pattern cell size
  className?: string;
};

export default function BackgroundPattern(props: BackgroundPatternProps)
{
  const {
    type = "leaf",
    color = "currentColor",
    opacity = 0.05,
    rotation = 45,
    strokeWidth = 1,
    spacing = 80,
    className = "",
  } = props;

  const id = useId();
  const patternId = `bg-pattern-${type}-${id}`;

  const renderPatternContent = () => {
    switch (type) {
      case "leaf":
        return (
          <path
            d="M20,20 Q40,0 60,20 Q80,40 60,60 Q40,80 20,60 Q0,40 20,20 Z"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
        );
      case "dots":
        return (
          <circle cx={spacing / 2} cy={spacing / 2} r={Math.max(1, strokeWidth)} fill={color} />
        );
      case "grid":
        return (
          <g>
            <path d={`M 0 0 L 0 ${spacing}`} stroke={color} strokeWidth={strokeWidth} fill="none" />
            <path d={`M 0 0 L ${spacing} 0`} stroke={color} strokeWidth={strokeWidth} fill="none" />
          </g>
        );
      case "diagonal":
        return (
          <path d={`M 0 ${spacing} L ${spacing} 0`} stroke={color} strokeWidth={strokeWidth} fill="none" />
        );
      case "waves":
        return (
          <path
            d={`M 0 ${spacing / 2} C ${spacing / 4} ${spacing / 4}, ${(3 * spacing) / 4} ${(3 * spacing) / 4}, ${spacing} ${spacing / 2}`}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
          />
        );
      default:
        return null;
    }
  };

  return(
    <div className={`absolute inset-0 z-0 ${className}`} style={{ opacity }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id={patternId}
            patternUnits="userSpaceOnUse"
            width={spacing}
            height={spacing}
            patternTransform={`rotate(${rotation})`}
          >
            {renderPatternContent()}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  )
}