import { DetailedHTMLProps } from "react";

export function Table(
    props: DetailedHTMLProps<React.ImgHTMLAttributes<HTMLTableElement>, HTMLTableElement>,
) {
    return (
        <div className="overflow-scroll sm:overflow-visible">
            <table {...props} />
        </div>
    );
}