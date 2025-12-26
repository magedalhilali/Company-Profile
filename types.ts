import { ReactNode } from 'react';

export interface FlipBookProps {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEvent?: boolean;
    swipeDistance?: number;
    onFlip?: (e: { data: number }) => void;
    onChangeOrientation?: (e: { data: 'portrait' | 'landscape' }) => void;
    onChangeState?: (e: { data: string }) => void;
    className?: string;
    style?: React.CSSProperties;
    ref?: React.Ref<any>;
    children: ReactNode;
}

export interface PageProps {
  image: string;
  pageNumber: number;
  total: number;
}