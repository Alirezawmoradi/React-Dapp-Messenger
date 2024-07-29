import React, { useEffect, useRef } from "react";
import ModelViewer from "@metamask/logo";

const MetaMaskLogo = () => {
    const elRef = useRef(null);
    const viewerRef = useRef(null);

    useEffect(() => {
        if (!viewerRef.current) {
            viewerRef.current = ModelViewer({
                pxNotRatio: true,
                width: 200,
                height: 200,
                followMouse: true,
            });
            if (elRef.current) {
                elRef.current.appendChild(viewerRef.current.container);
            }
        }

        return () => {
            if (viewerRef.current) {
                viewerRef.current.stopAnimation();
                if (elRef.current) {
                    elRef.current.removeChild(viewerRef.current.container);
                }
                viewerRef.current = null;
            }
        };
    }, []);

    return <div ref={elRef} className="w-full h-full flex justify-center cursor-pointer items-center"></div>;
};

export default MetaMaskLogo;
