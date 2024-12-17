import { Avatar } from "@mui/material";
import { useTheme } from "@mui/system";
import React, { memo } from "react";
interface CustomAvatarProps {
  src?: string;
  alt?: string;
  spacing?: number;
  className?: string;
  variant?: "circular" | "rounded" | "square";
  isBlob?: boolean;
  style?: any;
}

const CustomAvatar: React.FC<CustomAvatarProps> = memo(
  ({ src, alt, spacing, className, variant, isBlob, ...props }) => {
    const theme = useTheme();
    return src === "" || typeof src === "undefined" ? (
      <Avatar
        className={className}
        style={{
          height: theme.spacing(spacing ? spacing : 4),
          width: theme.spacing(spacing ? spacing : 4),
          backgroundColor: theme.palette.secondary.main,
          color: theme.palette.secondary.contrastText,
          ...props.style,
        }}
        variant={variant}
      >
        <small
          style={{
            textAlign: "center",
            textTransform: "uppercase",
            fontSize: `.7em`,
            fontWeight: 900,
            letterSpacing: ".3pt",
          }}
        >
          {alt}
        </small>
      </Avatar>
    ) : isBlob ? (
      <Avatar
        className={className}
        style={{
          height: theme.spacing(spacing ? spacing : 4),
          width: theme.spacing(spacing ? spacing : 4),
          ...props.style,
        }}
        variant={variant}
        src={`data:image/png;base64,` + src}
      />
    ) : (
      <Avatar
        className={className}
        style={{
          height: theme.spacing(spacing ? spacing : 4),
          width: theme.spacing(spacing ? spacing : 4),
        }}
        variant={variant}
        src={src}
      />
    );
  }
);

export default CustomAvatar;
