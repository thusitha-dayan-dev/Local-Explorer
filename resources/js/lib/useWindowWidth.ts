import { useState, useEffect } from 'react';

export const useWindowWidth = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Window එක resize වෙද්දී මේ function එක run වෙන්න ඕනේ
        window.addEventListener('resize', handleResize);

        // Component එක අයින් වෙද්දී event listener එකත් අයින් කරනවා (Cleanup)
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
};
