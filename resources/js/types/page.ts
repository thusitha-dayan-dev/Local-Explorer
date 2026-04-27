//page.ts
import type { IconDefinition } from '@fortawesome/free-regular-svg-icons';

export type SiderPageData = {
    hedder: string;
    title: string;
    list: SiderPageItem[];
};

export type PageSiderProps = {
    signupPageData: SiderPageData;
};

export type SiderPageItem = {
    icon: IconDefinition;
    hed: string;
    massage: string;
    iconColor: string;
};
