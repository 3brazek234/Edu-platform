


import type { ComponentType } from 'react';

export interface Package {
    id: string;
    name: string;
    icon: ComponentType<unknown>;
    description: string;
    sessions: number;
    price: number;
    originalPrice?: number;
    features: string[];
    popular?: boolean;
    recommended?: boolean;
    color: string;
}

export interface Subject {
    id: string;
    title: { rendered: string };
    content: { rendered: string };
}