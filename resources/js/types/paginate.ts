import { PlaceReview } from './web';

export type PlaceReviewPaginate = {
    current_page: number;
    data: PlaceReview[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};
