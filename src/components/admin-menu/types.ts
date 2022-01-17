import React from "react";

export type AdminMenuProps={
    onClick: (e: React.MouseEvent, data: any) => void;
    activeItem: string;
}