import { CSSProperties, DetailedHTMLProps } from "react";
import { useImagePath } from "~/context";

interface ImageProps
    extends DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    height?: string | number;
    width?: string | number;
    alt?: string;
    src?: string;
}

export function Image(props: ImageProps) {
    const src = useImagePath(props.src || '');

    const style: CSSProperties = {
        height: props.height ? parseInt(`${props.height}`) : 'inherit',
        width: props.width ? parseInt(`${props.width}`) : 'inherit',
    };

    return <img {...props} style={style} src={src} alt={props.alt ?? ''} loading="lazy" />;
}