export default function ProgressiveBlur() {
    const blurLayers = [
        // {
        //     zIndex: 1,
        //     blur: "0.179688px",
        //     mask: "linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 12.5%, rgb(0,0,0) 25%, rgba(0,0,0,0) 37.5%)",
        // },
        // {
        //     zIndex: 2,
        //     blur: "0.359375px",
        //     mask: "linear-gradient(rgba(0,0,0,0) 12.5%, rgb(0,0,0) 25%, rgb(0,0,0) 37.5%, rgba(0,0,0,0) 50%)",
        // },
        // {
        //     zIndex: 3,
        //     blur: "0.71875px",
        //     mask: "linear-gradient(rgba(0,0,0,0) 25%, rgb(0,0,0) 37.5%, rgb(0,0,0) 50%, rgba(0,0,0,0) 62.5%)",
        // },
        // {
        //     zIndex: 4,
        //     blur: "1.4375px",
        //     mask: "linear-gradient(rgba(0,0,0,0) 37.5%, rgb(0,0,0) 50%, rgb(0,0,0) 62.5%, rgba(0,0,0,0) 75%)",
        // },
        // {
        //     zIndex: 5,
        //     blur: "2.875px",
        //     mask: "linear-gradient(rgba(0,0,0,0) 50%, rgb(0,0,0) 62.5%, rgb(0,0,0) 75%, rgba(0,0,0,0) 87.5%)",
        // },
        {
            zIndex: 6,
            blur: "5.75px",
            mask: "linear-gradient(rgba(0,0,0,0) 62.5%, rgb(0,0,0) 75%, rgb(0,0,0) 87.5%, rgba(0,0,0,0) 100%)",
        },
        {
            zIndex: 7,
            blur: "11.5px",
            mask: "linear-gradient(rgba(0,0,0,0) 75%, rgb(0,0,0) 87.5%, rgb(0,0,0) 100%)",
        },
        {
            zIndex: 8,
            blur: "23px",
            mask: "linear-gradient(rgba(0,0,0,0) 87.5%, rgb(0,0,0) 100%)",
        },
    ];

    return (
        <div className="relative w-full h-full overflow-hidden">
            {blurLayers.map((layer) => (
                <div
                    key={layer.zIndex}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        zIndex: layer.zIndex,
                        backdropFilter: `blur(${layer.blur})`,
                        WebkitBackdropFilter: `blur(${layer.blur})`,
                        maskImage: layer.mask,
                        WebkitMaskImage: layer.mask,
                    }}
                />
            ))}
        </div>
    );
}
